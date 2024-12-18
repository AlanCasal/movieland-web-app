import { useCallback, useRef } from 'react';

const DEFAULT_ROOT_MARGIN = '300px';
const DEFAULT_THRESHOLD = 0;

export const useInfiniteScroll = ({
	fetchStatus,
	currentPage,
	totalPages,
	onLoadMore,
	threshold = DEFAULT_THRESHOLD,
	rootMargin = DEFAULT_ROOT_MARGIN,
	hasMoreResults = false,
}) => {
	const observer = useRef();

	const lastElementRef = useCallback(
		node => {
			if (fetchStatus === 'loading' || currentPage >= totalPages) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(
				entries => {
					if (entries[0].isIntersecting && hasMoreResults)
						onLoadMore(currentPage + 1);
				},
				{
					threshold,
					rootMargin,
				}
			);

			if (node) observer.current.observe(node);
		},
		[
			fetchStatus,
			currentPage,
			totalPages,
			onLoadMore,
			threshold,
			rootMargin,
			hasMoreResults,
		]
	);

	return { lastElementRef };
};
