type VisualizerVariant = "TopRight" | "BottomLeft";

type VisualizerProps = {
  ClassName?: string;
  Style?: React.CSSProperties;
  Variant: VisualizerVariant;
};

type BlobDefinition = {
  Background: string;
  ClipPath: string;
  Opacity: number;
};

const VisualizerBlobs: Record<VisualizerVariant, BlobDefinition[]> = {
  TopRight: [
    {
      Background: "var(--blob-pink)",
      ClipPath: "ellipse(47% 39% at 62% 34%)",
      Opacity: 0.92,
    },
    {
      Background: "var(--blob-violet)",
      ClipPath: "ellipse(46% 28% at 46% 48%)",
      Opacity: 0.46,
    },
    {
      Background: "var(--blob-lime)",
      ClipPath: "ellipse(36% 42% at 78% 78%)",
      Opacity: 0.36,
    },
  ],
  BottomLeft: [
    {
      Background: "var(--blob-pink)",
      ClipPath: "ellipse(47% 39% at 38% 66%)",
      Opacity: 0.92,
    },
    {
      Background: "var(--blob-violet)",
      ClipPath: "ellipse(46% 28% at 54% 48%)",
      Opacity: 0.46,
    },
    {
      Background: "var(--blob-lime)",
      ClipPath: "ellipse(36% 42% at 22% 22%)",
      Opacity: 0.36,
    },
  ],
};

export function Visualizer({ ClassName, Style, Variant }: VisualizerProps) {
  return (
    <div aria-hidden="true" className={ClassName} style={Style}>
      {VisualizerBlobs[Variant].map((Blob, Index) => (
        <span
          key={`${Variant}-${Index}`}
          className="absolute inset-0"
          style={{
            background: Blob.Background,
            clipPath: Blob.ClipPath,
            opacity: Blob.Opacity,
          }}
        />
      ))}
    </div>
  );
}
