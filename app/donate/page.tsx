"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { DonationForm } from "../_components/donation-form";
import { DonationHistory } from "../_components/donation-history";
import { PaymentDialog } from "../_components/payment-dialog";
import { PageShell } from "@/components/layout/page-shell";
import { PageContainer } from "@/components/layout/page-container";
import { useRevealObserver } from "../hooks/use-reveal-observer";
import {
  MAX_DONATION_AMOUNT,
  MIN_DONATION_AMOUNT,
} from "@/lib/donation-config";
import { getDonationContent } from "@/skeleton-data/portfolio";
import {
  queryKeys,
  useCreatePaymentMutation,
  useDonationHistory,
  useLatestPayment,
  usePaymentStatus,
  cancelPayment,
} from "@/app/services/queries";

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
  const [senderName, setSenderName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);
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

  useRevealObserver(0.1, '0px 0px -50px 0px');

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

    if (status === "SUCCESS") {
      setIsPaymentProcessing(true);
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

    if (status === "FAIL") {
      setShowQR(false);
      setIsPaymentProcessing(false);
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

  const clampAmount = (value: number) => {
    if (value < MIN_DONATION_AMOUNT) return MIN_DONATION_AMOUNT;
    if (value > MAX_DONATION_AMOUNT) return MAX_DONATION_AMOUNT;
    return value;
  };

  const handleAmountSelect = (preset: number) => {
    setAmount(clampAmount(preset));
  };

  const handleAmountChange = (value: string) => {
    const num = Number(value);
    if (Number.isNaN(num)) return;
    setAmount(clampAmount(Math.round(num)));
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
  const isHistoryLoading = donationHistoryQuery.isLoading;

  return (
    <PageShell>
      <div className="relative z-10 font-mono">
        <PageContainer>
          <section className="flex flex-col gap-4 sm:gap-5">
            {/* Donation form — top */}
            <div id="support" data-reveal className="reveal">
              <DonationForm
                amount={amount}
                senderName={senderName}
                message={message}
                isLoading={isLoading}
                onAmountSelect={handleAmountSelect}
                onAmountChange={handleAmountChange}
                onSenderNameChange={setSenderName}
                onMessageChange={setMessage}
                onDonate={handleDonate}
              />
            </div>

            {/* Donation history — below */}
            <div data-reveal className="reveal">
              <DonationHistory
                donationHistory={donationHistory}
                isLoading={isHistoryLoading}
                isError={donationHistoryQuery.isError}
                pagination={historyPagination}
                historyPage={historyPage}
                onPrevPage={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
                onNextPage={() => setHistoryPage((prev) => prev + 1)}
              />
            </div>
          </section>
        </PageContainer>
      </div>

      {isPaymentProcessing && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-black/75 backdrop-blur-sm">
          <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-sm font-medium text-white/80 tracking-wide">
            {t("PAYMENT.PROCESSING.001")}
          </p>
        </div>
      )}

      <PaymentDialog
        open={isDialogOpen}
        onOpenChange={setShowQR}
        qrCode={payment?.qrCode ?? ""}
        checkoutUrl={payment?.checkoutUrl ?? ""}
        isProcessing={isPaymentProcessing}
        onCancel={async () => {
          if (!orderCode) {
            setShowQR(false);
            return;
          }
          try {
            await cancelPayment(orderCode, 'User cancelled');
          } catch {
            // best-effort cancel
          }
          setShowQR(false);
          setIsPaymentProcessing(false);
          createPaymentMutation.reset();
          queryClient.removeQueries({ queryKey: queryKeys.payment });
          queryClient.removeQueries({ queryKey: queryKeys.paymentStatus(orderCode) });
          router.push("/donation/cancel");
        }}
      />


    </PageShell>
  );
}
