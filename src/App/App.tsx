import React, {
	ChangeEvent,
	FormEvent,
	Component
} from 'react';
import {
	hot
} from 'react-hot-loader';
import {
	Bind
} from '@flexis/ui/helpers';
import '@flexis/ui/reboot.st.css';
import {
	getCancelToken,
	isCancelToken
} from '~/services/axios';
import * as steamService from '~/services/steam';
import FormGroup from '~/components/FormGroup';
import Textarea from '~/components/Textarea';
import Button from '~/components/Button';
import SROnly from '~/components/SROnly';
import Spinner from '~/components/Spinner';
import GamesList, {
	GamesListItem
 } from '~/components/GamesList';
import {
	classes
} from './App.st.css';

interface IState {
	links: string[];
	linksText: string;
	games: steamService.IAppInfo[];
	inProgress: boolean;
	error: string;
}

const SearchCommonGamesCancellationKey = Symbol('SearchCommonGamesCancellationKey');
const maxLinksCount = 20;
const linksPlaceholder = `
https://steamcommunity.com/profiles/76561197999469156
https://steamcommunity.com/id/molotoko
Tryr
`.trim();

@hot(module)
export default class App extends Component<{}, IState> {

	state = {
		links:      [],
		linksText:  '',
		games:      [],
		inProgress: false,
		error:      ''
	};

	render() {

		const {
			linksText,
			error,
			inProgress,
			games
		} = this.state;

		return (
			<form
				className={classes.root}
				onSubmit={this.onSubmit}
			>
				<h1>
					Common steam games search
				</h1>
				<FormGroup
					label='Users links:'
				>
					<Textarea
						className={classes.textarea}
						id='links'
						name='links'
						placeholder={linksPlaceholder}
						required
						onChange={this.onLinksChange}
						value={linksText}
					/>
				</FormGroup>
				<footer
					className={classes.footer}
				>
					<Button
						color='success'
					>
						Search common steam games
					</Button>
				</footer>
				{error && (
					<p
						className={classes.error}
					>
						{error}
					</p>
				)}
				<GamesList>
					{games.map(game => (
						<GamesListItem
							key={game.id}
							{...game}
						/>
					))}
				</GamesList>
				{inProgress && (
					<div
						className={classes.loading}
					>
						<Spinner
							className={classes.spinner}
							color='primary'
						>
							<SROnly>
								<span>Loading...</span>
							</SROnly>
						</Spinner>
					</div>
				)}
			</form>
		);
	}

	@Bind()
	onLinksChange(value: string, event: ChangeEvent<HTMLTextAreaElement>) {

		const {
			target
		} = event;
		const {
			validity
		} = target;
		const links = value.trim().split(/,|\s/).map(_ => _.trim()).filter(Boolean);
		const uniqueLinks = new Set(links);

		switch (true) {

			case validity.valueMissing:
			default:
				target.setCustomValidity('');
				break;

			case links.length <= 1:
				target.setCustomValidity('You should provide minimum 2 links.');
				break;

			case uniqueLinks.size !== links.length:
				target.setCustomValidity('You should provide unique links list.');
				break;

			case links.length > maxLinksCount:
				target.setCustomValidity(`You should provide maximum ${maxLinksCount} links.`);
		}

		this.setState(() => ({
			links,
			linksText: value,
			error:     ''
		}));
	}

	@Bind()
	onSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault();

		const {
			links
		} = this.state;

		this.searchCommonGames(links);
	}

	private async searchCommonGames(links: string[]) {

		this.setState(() => ({
			games:      [],
			inProgress: true,
			error:      ''
		}));

		try {

			const games = await steamService.fetchCommonGames(
				links,
				getCancelToken(SearchCommonGamesCancellationKey)
			);

			this.setState(() => ({
				games,
				inProgress: false
			}));

		} catch (err) {

			this.setState(() => ({
				games:      [],
				inProgress: isCancelToken(err),
				error:      err.message
			}));
		}
	}
}
