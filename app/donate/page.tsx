"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DonationForm } from "../_components/donation-form";
import { PaymentDialog } from "../_components/payment-dialog";
import {
  MAX_DONATION_AMOUNT,
  MIN_DONATION_AMOUNT,
} from "@/lib/donation-config";
import { cn } from "@/lib/utils";
import { getDonationContent } from "@/skeleton-data/portfolio";
import {
  queryKeys,
  useCreatePaymentMutation,
  useDonationHistory,
  useLatestPayment,
  usePaymentStatus,
} from "@/app/services/queries";
import type { DonationHistoryItemDTO } from "@/types/api";

const HISTORY_PAGE_SIZE = 6;

export default function DonatePage() {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const router = useRouter();

  const currencyLabel = t("DONATE.CURRENCY.001");
  const minAmountLabel = useMemo(
    () => MIN_DONATION_AMOUNT.toLocaleString(locale),
    [locale],
  );
  const maxAmountLabel = useMemo(
    () => MAX_DONATION_AMOUNT.toLocaleString(locale),
    [locale],
  );

  const donationContent = getDonationContent(t, {
    minAmountLabel,
    currencyLabel,
  });

  const [amount, setAmount] = useState<number>(MIN_DONATION_AMOUNT);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [selectedHistory, setSelectedHistory] =
    useState<DonationHistoryItemDTO | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyPage, setHistoryPage] = useState<number>(1);

  const createPaymentMutation = useCreatePaymentMutation();
  const latestPaymentQuery = useLatestPayment();
  const payment = latestPaymentQuery.data;
  const orderCode = payment?.orderCode ?? null;

  const paymentStatusQuery = usePaymentStatus(
    orderCode,
    Boolean(orderCode),
  );

  const donationHistoryQuery = useDonationHistory({
    page: historyPage,
    limit: HISTORY_PAGE_SIZE,
  });
  const donationHistory = donationHistoryQuery.data?.data ?? [];
  const historyPagination = donationHistoryQuery.data?.pagination;
  const historyTotalAmount = donationHistory.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );

  useEffect(() => {
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (!revealNodes.length) return;

    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  useEffect(() => {
    const status = paymentStatusQuery.data?.status;
    if (!status) return;

    if (status === "PAID") {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#00ff88", "#00aaff", "#ff0088", "#ffaa00"],
      });
      toast.success(t("DONATE.TOAST.PAID.TITLE.001"), {
        duration: 5000,
      });

      setShowQR(false);
      createPaymentMutation.reset();
      queryClient.removeQueries({ queryKey: queryKeys.payment });
      if (orderCode) {
        queryClient.removeQueries({
          queryKey: queryKeys.paymentStatus(orderCode),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.donationHistoryBase,
      });
      router.push("/donation/success");
      return;
    }

    if (status === "CANCELLED" || status === "FAILED") {
      setShowQR(false);
      createPaymentMutation.reset();
      queryClient.removeQueries({ queryKey: queryKeys.payment });
      if (orderCode) {
        queryClient.removeQueries({
          queryKey: queryKeys.paymentStatus(orderCode),
        });
      }
      router.push("/donation/cancel");
    }
  }, [
    createPaymentMutation,
    orderCode,
    paymentStatusQuery.data?.status,
    queryClient,
    router,
    t,
  ]);

  const handleAmountSelect = (preset: number) => {
    setAmount(preset);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= MIN_DONATION_AMOUNT) {
      setAmount(num);
    }
  };

  const handleDonate = async () => {
    if (amount < MIN_DONATION_AMOUNT) {
      toast.error(
        t("DONATE.TOAST.MIN_AMOUNT.TITLE.001", {
          amount: `${minAmountLabel} ${currencyLabel}`,
        }),
        {
          description: t("DONATE.TOAST.MIN_AMOUNT.DESC.001"),
        },
      );
      return;
    }

    if (amount > MAX_DONATION_AMOUNT) {
      toast.error(
        t("DONATE.TOAST.MAX_AMOUNT.TITLE.001", {
          amount: `${maxAmountLabel} ${currencyLabel}`,
        }),
        {
          description: t("DONATE.TOAST.MAX_AMOUNT.DESC.001"),
        },
      );
      return;
    }

    try {
      const trimmedSenderName = senderName.trim();
      const isAnonymous = trimmedSenderName.length === 0;
      const resolvedSenderName = isAnonymous
        ? donationContent.namePlaceholder
        : trimmedSenderName;

      await createPaymentMutation.mutateAsync({
        amount,
        senderName: resolvedSenderName,
        message,
        isAnonymous,
      });

      setShowQR(true);

      toast.success(t("DONATE.TOAST.QR_SUCCESS.TITLE.001"), {
        description: t("DONATE.TOAST.QR_SUCCESS.DESC.001"),
      });
    } catch (error: unknown) {
      console.error(error);
      toast.error(t("DONATE.TOAST.CREATE_FAILED.TITLE.001"), {
        description: t("DONATE.TOAST.CREATE_FAILED.DESC.001"),
      });
    }
  };

  const isLoading = createPaymentMutation.isPending;
  const isDialogOpen = showQR && Boolean(payment?.qrCode);

  const formatAmount = (value: number) =>
    `${value.toLocaleString(locale)} ${currencyLabel}`;

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  const statusLabels = useMemo(
    () => ({
      PAID: t("DONATE.HISTORY.STATUS.PAID"),
      PENDING: t("DONATE.HISTORY.STATUS.PENDING"),
      CANCELLED: t("DONATE.HISTORY.STATUS.CANCELLED"),
      FAILED: t("DONATE.HISTORY.STATUS.FAILED"),
    }),
    [t],
  );
  const getStatusLabel = (status: string) =>
    statusLabels[status as keyof typeof statusLabels] ?? status;

  const totalEntries = historyPagination?.total ?? 0;
  const totalPages = historyPagination?.totalPages ?? 1;
  const hasPrevPage = historyPagination?.hasPrevPage ?? false;
  const hasNextPage = historyPagination?.hasNextPage ?? false;
  const isHistoryLoading = donationHistoryQuery.isLoading;

  const handleHistoryOpenChange = (open: boolean) => {
    setIsHistoryOpen(open);
    if (!open) {
      setSelectedHistory(null);
    }
  };

  return (
    <div className="relative min-h-[calc(100svh-var(--footer-h))] overflow-x-hidden bg-transparent text-[var(--hero-foreground)]">
      <div className="relative z-10 font-mono">
        <main className="mx-auto flex h-full w-full flex-col px-6 pb-6 pt-[calc(var(--header-h)+0.75rem)] md:px-10 md:pb-8 xl:px-16">
          <section className="flex min-h-0 flex-1 flex-col gap-6 xl:gap-8">
            <div className="grid min-h-0 flex-1 grid-rows gap-6 xl:grid-cols-10 xl:grid-rows-1">
              {/* Donation form */}
              <div
                id="support"
                data-reveal
                className="reveal xl:col-span-3"
              >
                <DonationForm
                  className="h-full min-h-0"
                  amount={amount}
                  customAmount={customAmount}
                  senderName={senderName}
                  message={message}
                  isLoading={isLoading}
                  onAmountSelect={handleAmountSelect}
                  onCustomAmountChange={handleCustomAmountChange}
                  onSenderNameChange={setSenderName}
                  onMessageChange={setMessage}
                  onDonate={handleDonate}
                />
              </div>

              {/* Donation history */}
              <div data-reveal className="reveal h-full min-h-0 xl:col-span-7">
                <div className="glass-panel neon-border rounded-3xl p-6 md:p-8 relative overflow-hidden h-full min-h-0 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-[var(--hero-accent)]/10 pointer-events-none" />
                  <div className="relative flex h-full min-h-0 flex-col gap-6 lg:gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                          {t("DONATE.HISTORY.TITLE.001")}
                        </p>
                        <h2 className="text-2xl font-heading text-glow sm:text-3xl">
                          {t("DONATE.HISTORY.SUBTITLE.001")}
                        </h2>
                        <p className="text-sm text-[var(--hero-muted)] max-w-2xl">
                          {t("DONATE.HISTORY.TEXT.001")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] sm:text-sm">
                        <div className="rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 px-3 py-1.5 sm:px-4 sm:py-2">
                          <span className="text-[var(--hero-muted)]">
                            {t("DONATE.HISTORY.STATS.TOTAL_ENTRIES")}
                          </span>
                          {isHistoryLoading ? (
                            <span className="ml-2 inline-block h-4 w-10 rounded-full bg-[var(--hero-border)]/40 align-middle animate-pulse" />
                          ) : (
                            <span className="ml-2 text-[var(--hero-foreground)] font-semibold">
                              {totalEntries}
                            </span>
                          )}
                        </div>
                        <div className="rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 px-3 py-1.5 sm:px-4 sm:py-2">
                          <span className="text-[var(--hero-muted)]">
                            {t("DONATE.HISTORY.STATS.PAGE_TOTAL")}
                          </span>
                          {isHistoryLoading ? (
                            <span className="ml-2 inline-block h-4 w-16 rounded-full bg-[var(--hero-border)]/40 align-middle animate-pulse" />
                          ) : (
                            <span className="ml-2 text-[var(--hero-foreground)] font-semibold">
                              {formatAmount(historyTotalAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-2">
                      {isHistoryLoading && (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div
                              key={`history-skeleton-${index}`}
                              className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-2">
                                  <div className="h-4 w-36 rounded-full bg-[var(--hero-border)]/40 animate-pulse" />
                                  <div className="h-3 w-48 rounded-full bg-[var(--hero-border)]/30 animate-pulse" />
                                </div>
                                <div className="space-y-2 text-right">
                                  <div className="h-4 w-24 rounded-full bg-[var(--hero-border)]/40 animate-pulse" />
                                  <div className="h-3 w-20 rounded-full bg-[var(--hero-border)]/30 animate-pulse ml-auto" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isHistoryLoading && donationHistoryQuery.isError && (
                        <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 text-sm text-[var(--hero-muted)]">
                          {t("ERROR.MESSAGE.003")}
                        </div>
                      )}

                      {!isHistoryLoading &&
                        !donationHistoryQuery.isError &&
                        donationHistory.length === 0 && (
                          <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 text-sm text-[var(--hero-muted)]">
                            {t("DONATE.HISTORY.EMPTY.001")}
                          </div>
                        )}

                      {!isHistoryLoading &&
                        !donationHistoryQuery.isError &&
                        donationHistory.map((entry) => {
                          const displayName = entry.isAnonymous
                            ? t("DONATE.HISTORY.ANONYMOUS")
                            : entry.senderName || t("DONATE.HISTORY.ANONYMOUS");

                          return (
                            <button
                              key={entry.id}
                              type="button"
                              onClick={() => {
                                setSelectedHistory(entry);
                                setIsHistoryOpen(true);
                              }}
                              className="w-full text-left rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]/70"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-[var(--hero-foreground)]">
                                      {displayName}
                                    </span>
                                    <span
                                      className={cn(
                                        "rounded-full px-2 py-0.5 text-xs uppercase tracking-[0.2em]",
                                        entry.status === "PAID"
                                          ? "bg-emerald-500/15 text-emerald-300"
                                          : entry.status === "PENDING"
                                            ? "bg-yellow-500/15 text-yellow-300"
                                            : "bg-red-500/15 text-red-300",
                                      )}
                                    >
                                      {getStatusLabel(entry.status)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[var(--hero-muted)] line-clamp-1">
                                    {entry.message ||
                                      t("DONATE.HISTORY.MESSAGE.NONE")}
                                  </p>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="text-lg font-heading text-glow">
                                    {formatAmount(entry.amount)}
                                  </div>
                                  <div className="text-xs text-[var(--hero-muted)]">
                                    {formatDate(entry.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--hero-border)] pt-4 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                      <span>
                        {t("DONATE.HISTORY.PAGINATION.LABEL", {
                          page: historyPage,
                          total: totalPages,
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasPrevPage || isHistoryLoading}
                          onClick={() =>
                            setHistoryPage((prev) => Math.max(1, prev - 1))
                          }
                          className="text-[10px]"
                        >
                          {t("DONATE.HISTORY.PAGINATION.PREV")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasNextPage || isHistoryLoading}
                          onClick={() => setHistoryPage((prev) => prev + 1)}
                          className="text-[10px]"
                        >
                          {t("DONATE.HISTORY.PAGINATION.NEXT")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <PaymentDialog
        open={isDialogOpen}
        onOpenChange={setShowQR}
        qrCode={payment?.qrCode ?? ""}
        checkoutUrl={payment?.checkoutUrl ?? ""}
      />

      <Dialog open={isHistoryOpen} onOpenChange={handleHistoryOpenChange}>
        <DialogContent className="border-[var(--hero-border)] bg-[var(--hero-surface-strong)] text-[var(--hero-foreground)] max-w-lg">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-glow text-2xl">
              {t("DONATE.HISTORY.DETAILS.TITLE")}
            </DialogTitle>
            <DialogDescription className="text-[var(--hero-muted)]">
              {t("DONATE.HISTORY.DETAILS.SUBTITLE")}
            </DialogDescription>
          </DialogHeader>
          {selectedHistory && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                      {t("DONATE.HISTORY.DETAILS.LABEL.AMOUNT")}
                    </p>
                    <p className="text-3xl font-heading text-glow">
                      {formatAmount(selectedHistory.amount)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]",
                      selectedHistory.status === "PAID"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : selectedHistory.status === "PENDING"
                          ? "bg-yellow-500/15 text-yellow-300"
                          : "bg-red-500/15 text-red-300",
                    )}
                  >
                    {getStatusLabel(selectedHistory.status)}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">
                    {t("DONATE.HISTORY.DETAILS.LABEL.DONOR")}
                  </span>
                  <span className="font-medium">
                    {selectedHistory.isAnonymous
                      ? t("DONATE.HISTORY.ANONYMOUS")
                      : selectedHistory.senderName ||
                        t("DONATE.HISTORY.ANONYMOUS")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">
                    {t("DONATE.HISTORY.DETAILS.LABEL.DONATION_ID")}
                  </span>
                  <span className="font-medium">{selectedHistory.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">
                    {t("DONATE.HISTORY.DETAILS.LABEL.DATE")}
                  </span>
                  <span className="font-medium">
                    {formatDate(selectedHistory.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--hero-border)] pb-2">
                  <span className="text-[var(--hero-muted)]">
                    {t("DONATE.HISTORY.DETAILS.LABEL.METHOD")}
                  </span>
                  <span className="font-medium">
                    {selectedHistory.method || t("DONATE.HISTORY.METHOD.PAYOS")}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)] mb-2">
                  {t("DONATE.HISTORY.DETAILS.LABEL.MESSAGE")}
                </p>
                <p className="text-[var(--hero-foreground)]">
                  {selectedHistory.message || t("DONATE.HISTORY.MESSAGE.NONE")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
