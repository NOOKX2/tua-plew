"use client";

import { useRef, useState } from "react";

export type MapSheetSnap = "hidden" | "peek" | "half" | "full";

const SNAP_RATIOS: Record<MapSheetSnap, number> = {
  hidden: 0.07,
  peek: 0.4,
  half: 0.58,
  full: 0.88,
};

function nearestSnap(ratio: number): MapSheetSnap {
  let best: MapSheetSnap = "peek";
  let bestDistance = Infinity;

  for (const [snap, snapRatio] of Object.entries(SNAP_RATIOS) as [
    MapSheetSnap,
    number,
  ][]) {
    const distance = Math.abs(snapRatio - ratio);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = snap;
    }
  }

  return best;
}

type Props = {
  snap: MapSheetSnap;
  onSnapChange: (snap: MapSheetSnap) => void;
  toolbar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
};

export function isMapSheetHidden(snap: MapSheetSnap) {
  return snap === "hidden";
}

export default function MobileMapListSheet({
  snap,
  onSnapChange,
  toolbar,
  header,
  children,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const dragStart = useRef({ y: 0, ratio: SNAP_RATIOS.peek });

  const currentRatio = dragRatio ?? SNAP_RATIOS[snap];
  const isDragging = dragRatio !== null;

  function getContainerHeight() {
    return sheetRef.current?.parentElement?.clientHeight ?? window.innerHeight;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { y: event.clientY, ratio: SNAP_RATIOS[snap] };
    setDragRatio(SNAP_RATIOS[snap]);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    const containerHeight = getContainerHeight();
    if (containerHeight <= 0) return;

    const deltaY = dragStart.current.y - event.clientY;
    const nextRatio = Math.min(
      0.92,
      Math.max(0.05, dragStart.current.ratio + deltaY / containerHeight),
    );
    setDragRatio(nextRatio);
  }

  function finishDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);

    const ratio = dragRatio ?? SNAP_RATIOS[snap];
    setDragRatio(null);
    onSnapChange(nearestSnap(ratio));
  }

  return (
    <div
      ref={sheetRef}
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-2xl border border-zinc-200/80 bg-zinc-50 shadow-[0_-10px_40px_rgba(0,0,0,0.14)] lg:hidden"
      style={{
        height: `${currentRatio * 100}%`,
        transition: isDragging ? "none" : "height 280ms cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <div
        className="shrink-0 touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div
          className="flex cursor-grab items-center justify-center py-3 active:cursor-grabbing"
          aria-hidden
        >
          <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
        </div>
        {toolbar}
      </div>

      {header}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
