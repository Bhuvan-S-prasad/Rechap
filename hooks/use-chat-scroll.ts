import { useEffect, useRef, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const prevScrollHeightRef = useRef<number>(0);

  // Auto-load older messages when user scrolls near the top
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop !== undefined && scrollTop <= 100 && shouldLoadMore) {
        // Save scroll height before loading so we can restore position later
        prevScrollHeightRef.current = topDiv?.scrollHeight ?? 0;
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [chatRef, loadMore, shouldLoadMore]);

  // Preserve scroll position after older messages are loaded
  useEffect(() => {
    const el = chatRef.current;
    if (el && prevScrollHeightRef.current > 0) {
      const newScrollHeight = el.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;
      if (diff > 0) {
        el.scrollTop = diff;
      }
      prevScrollHeightRef.current = 0;
    }
  });

  // Auto-scroll to bottom on initial load and when new messages arrive
  // (only if user is already near the bottom)
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }
      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
