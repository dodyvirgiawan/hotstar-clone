import { PageLayout } from '@/ui/layouts';
import styles from './tv-series-detail-main.module.scss';
import { TvSeriesDetailMainProps } from './tv-series-detail-main.type';
import Head from 'next/head';
import Image from 'next/image';
import { TMDB_IMG_URL } from '@/constants/api';
import clsx from 'clsx';
import { getYear } from '@/lib/utils';
import { useAppSelector } from '@/redux/store';
import * as SL from '@/redux/slices';
import {
	Button,
	CardCarousel,
	RenderIf,
	TabItem,
	TabPanel,
	Tabs,
} from '@/ui/components';
import { tabs } from './tv-series-detail-main.constant';
import { useMemo, useState } from 'react';
import { CardTvWrapper } from '@/ui/components-wrapper';
import AddIcon from '../../../../../public/assets/add-icon.svg';
import RemoveIcon from '../../../../../public/assets/remove-icon.svg';
import { usePopulateWatchlist, useWatchlistStorage } from '@/lib/hooks';
import { sampleEpisode } from '../../../../../sample';

const TvSeriesDetailMain: React.FC<TvSeriesDetailMainProps> = (props) => {
	const { data } = props;

	const { loading } = usePopulateWatchlist();

	const { tvDetail, tvRecommendationIds } = data;

	const tvGenres = useAppSelector(SL.selectTvGenresByTvId(Number(tvDetail.id)));
	const tvSeasons = useAppSelector(
		SL.selectTvSeasonsByTvId(Number(tvDetail.id)),
	);

	const seasonTabs = useMemo<TabItem[]>(() => {
		if (!tvSeasons) return [];

		return tvSeasons.map((season) => ({
			id: season.id,
			value: `season-${season.season_number}`,
			label: season.name,
		}));
	}, [tvSeasons]);

	const tvGenreString = tvGenres?.map((item) => item.name);
	const title = `${tvDetail.name}, ${tvGenreString?.join(' ')} TV Series - Watch All Latest Episodes Online on Disney+ Hotstar`;

	const [tabValue, setTabValue] = useState(tabs[0].value);
	const [seasonTabValue, setSeasonTabValue] = useState(
		seasonTabs[0]?.value || '',
	);

	const {
		handlers: { onAddToWatchlist, onRemoveFromWatchlist },
		state: { isInWatchlist },
	} = useWatchlistStorage({
		currentWatchlistDetail: {
			id: `tv${tvDetail.id}`,
			mediaType: 'tv',
			mediaId: Number(tvDetail.id),
		},
	});

	return (
		<>
			<Head>
				<title>{title}</title>

				<meta content={title} name="title" />
				<meta content={tvDetail.overview} name="description" />
			</Head>

			<PageLayout>
				<div className={styles.tvSeriesDetailMainRoot}>
					<div className={styles.backdropContainer}>
						<Image
							priority
							alt={`${title} backdrop`}
							fill
							src={`${TMDB_IMG_URL}/w1280${tvDetail.backdrop_path}`} // ? Use small image size to improve performance
						/>

						<div className={styles.content}>
							<div className={styles.tvDetailContent}>
								<p className="font-h1">{tvDetail.name}</p>

								<div className={styles.detailChipContainer}>
									<div className={styles.chipItem}>
										<p className={clsx('font-small', styles.chipText)}>
											{getYear(tvDetail.first_air_date)}
										</p>
									</div>

									<div className={styles.circleDivider} />

									<div className={styles.chipItem}>
										<p className={clsx('font-small', styles.chipText)}>
											{tvDetail.seasons.length} Season
										</p>
									</div>

									<div className={styles.circleDivider} />

									<div className={styles.chipItem}>
										<p
											className={clsx(
												'font-small',
												styles.chipText,
												styles.language,
											)}
										>
											{tvDetail.original_language}
										</p>
									</div>
								</div>

								<p className={clsx('font-p', styles.overviewText)}>
									{tvDetail.overview}
								</p>

								<div className={styles.genreChipContainer}>
									{tvGenres?.map((genre, idx) => {
										const isLast = idx === tvGenres.length - 1;

										return (
											<>
												<div className={styles.chipItem}>
													<p className={clsx('font-small', styles.chipText)}>
														{genre.name}
													</p>
												</div>

												<RenderIf isTrue={!isLast}>
													<div className={styles.lineDivider} />
												</RenderIf>
											</>
										);
									})}
								</div>

								<div className={styles.buttonContainer}>
									<RenderIf isTrue={!isInWatchlist}>
										<Button
											loading={loading}
											fullWidth
											className={styles.button}
											onClick={onAddToWatchlist}
										>
											<div className={styles.logoContainer}>
												<Image alt="Select" src={AddIcon} />
											</div>

											<p className={clsx('font-p', styles.buttonText)}>
												Add to Watchlist
											</p>
										</Button>
									</RenderIf>

									<RenderIf isTrue={isInWatchlist}>
										<Button
											fullWidth
											className={styles.button}
											onClick={onRemoveFromWatchlist}
										>
											<div className={styles.logoContainer}>
												<Image priority alt="Deselect" src={RemoveIcon} />
											</div>

											<p className={clsx('font-p', styles.buttonText)}>
												Remove from Watchlist
											</p>
										</Button>
									</RenderIf>
								</div>
							</div>
						</div>

						<div className={styles.ornament} />
					</div>

					<div className={styles.tabContainer}>
						<Tabs tabs={tabs} value={tabValue} onChange={setTabValue} />
					</div>

					<TabPanel value="episodes" currentValue={tabValue}>
						<Tabs
							useBorder={false}
							tabs={seasonTabs}
							value={seasonTabValue}
							onChange={setSeasonTabValue}
						/>

						<div className={styles.seasonTabContainer}>
							{seasonTabs.map((season) => {
								return (
									<TabPanel
										key={season.id}
										value={season.value}
										currentValue={seasonTabValue}
									>
										<div className={styles.episodeContainer}>
											{/* <CardEpisode
												posterUrl={sampleEpisode.still_path}
												name={sampleEpisode.name}
												season={sampleEpisode.season_number}
												episode={sampleEpisode.episode_number}
												duration={sampleEpisode.runtime}
												airDate={sampleEpisode.air_date}
												overview={sampleEpisode.overview}
											/>

											<CardEpisode
												posterUrl={sampleEpisode.still_path}
												name={sampleEpisode.name}
												season={sampleEpisode.season_number}
												episode={sampleEpisode.episode_number}
												duration={sampleEpisode.runtime}
												airDate={sampleEpisode.air_date}
												overview={sampleEpisode.overview}
											/>

											<CardEpisode
												posterUrl={sampleEpisode.still_path}
												name={sampleEpisode.name}
												season={sampleEpisode.season_number}
												episode={sampleEpisode.episode_number}
												duration={sampleEpisode.runtime}
												airDate={sampleEpisode.air_date}
												overview={sampleEpisode.overview}
											/> */}
										</div>
										{season.label}
									</TabPanel>
								);
							})}
						</div>
					</TabPanel>

					<TabPanel value="more-like-this" currentValue={tabValue}>
						<div className={styles.cardContainer}>
							<CardCarousel>
								{tvRecommendationIds.map((id) => {
									return (
										<div key={id} className={styles.cardWrapper}>
											<CardTvWrapper id={Number(id)} mediaType="tv" />
										</div>
									);
								})}
							</CardCarousel>
						</div>
					</TabPanel>
				</div>
			</PageLayout>
		</>
	);
};

export default TvSeriesDetailMain;
