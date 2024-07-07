import React from 'react';

export interface CardEpisodeProps {
	name: string;
	season: number;
	episode: number;
	duration: number;
	airDate: string;
	overview: string;
	posterUrl: string;
	loading?: boolean;
}
