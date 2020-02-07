// tslint:disable: no-magic-numbers
import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import {
	number,
	text
} from '@storybook/addon-knobs/react';
import GamesList, {
	GamesListItem
} from './';

const stylableApi = `
Stylable API
---
- ::item
- ::link
- ::img
`;

const gamesListStyle = {
	margin:   '0 auto',
	maxWidth: '800px'
};

storiesOf('Components|GamesList', module)
	.addParameters({
		info: stylableApi
	})
	.add(
		'with games',
		() => {

			const gamesCount = number('Games count', 3);
			const games = Array.from({ length: gamesCount }, (_, i) => ({
				id: number(`Game #${i} id`, (i + 1) * 10),
				name: text(`Game #${i} name`, `Game #${i} name`)
			}));

			return (
				<GamesList
					style={gamesListStyle}
				>
					{games.map(game => (
						<GamesListItem
							key={game.id}
							{...game}
						/>
					))}
				</GamesList>
			);
		}
	);
