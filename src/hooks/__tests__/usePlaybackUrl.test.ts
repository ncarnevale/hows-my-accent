import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { usePlaybackUrl } from "@/hooks/usePlaybackUrl";

describe("usePlaybackUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when blob is null", () => {
    const createObjectURL = vi.spyOn(URL, "createObjectURL");

    const { result } = renderHook(() => usePlaybackUrl(null));

    expect(result.current).toBeNull();
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("returns an object URL for a blob and revokes it on unmount", () => {
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:playback");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    const blob = new Blob(["audio"], { type: "audio/webm" });
    const { result, unmount } = renderHook(() => usePlaybackUrl(blob));

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(result.current).toBe("blob:playback");

    unmount();

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:playback");
  });

  it("revokes the previous URL when the blob changes", () => {
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValueOnce("blob:first")
      .mockReturnValueOnce("blob:second");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    const firstBlob = new Blob(["first"], { type: "audio/webm" });
    const secondBlob = new Blob(["second"], { type: "audio/webm" });

    const { result, rerender } = renderHook(
      ({ blob }) => usePlaybackUrl(blob),
      { initialProps: { blob: firstBlob as Blob | null } },
    );

    expect(result.current).toBe("blob:first");

    rerender({ blob: secondBlob });

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:first");
    expect(createObjectURL).toHaveBeenCalledWith(secondBlob);
    expect(result.current).toBe("blob:second");
  });
});
