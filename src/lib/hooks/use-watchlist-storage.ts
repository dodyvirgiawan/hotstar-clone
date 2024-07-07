import { Watchlist } from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import * as SL from '@/redux/slices';
import { useMemo } from 'react';
import usePopulateWatchlist from './use-populate-watchlist';

const useWatchlistStorage = ({
	currentWatchlistDetail,
}: {
	currentWatchlistDetail: Watchlist;
}) => {
	const { id, mediaType } = currentWatchlistDetail;

	const dispatch = useAppDispatch();

	usePopulateWatchlist();

	const currentWatchlist: SL.Watchlist[] = useAppSelector(
		SL.selectAllWatchlists,
	);

	const handleAddToWatchlist = () => {
		dispatch(SL.insertToWatchlist(currentWatchlistDetail));

		const newWatchlists = [currentWatchlistDetail, ...currentWatchlist];
		localStorage.setItem('myWatchlist', JSON.stringify(newWatchlists));
	};

	const handleRemoveFromWatchlist = () => {
		dispatch(SL.removeFromWatchlist(currentWatchlistDetail));

		const newWatchlists = currentWatchlist.filter(
			(item) => item.id !== id && item.mediaType !== mediaType,
		);
		localStorage.setItem('myWatchlist', JSON.stringify(newWatchlists));
	};

	const isInWatchlist = useMemo(
		() =>
			!!currentWatchlist.find(
				(item) => item.id === id && item.mediaType === mediaType,
			),
		[currentWatchlist, id, mediaType],
	);

	return {
		handlers: {
			onAddToWatchlist: handleAddToWatchlist,
			onRemoveFromWatchlist: handleRemoveFromWatchlist,
		},
		state: {
			isInWatchlist,
		},
	};
};

export default useWatchlistStorage;