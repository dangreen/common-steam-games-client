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
import * as steamService from '~/services/steam';
import FormGroup from '~/components/FormGroup';
import Textarea from '~/components/Textarea';
import Button from '~/components/Button';
import SROnly from '~/components/SROnly';
import Spinner from '~/components/Spinner';
import Link from '~/components/Link';
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

const maxLinksCount = 20;
const linkPattern = /^https:\/\/steamcommunity\.com\/id\/[^/]+\/?$/;
const linkExample = 'https://steamcommunity.com/id/molotoko';
const linksPlaceholder = `
${linkExample}
https://steamcommunity.com/id/Tryr
https://steamcommunity.com/id/gwellir
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

	private removeMessageListener: () => void = null;
	private removeExceptionListener: () => void = null;

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
				<ul>
					{games.map(({
						id,
						name
					}) => (
						<li
							key={id}
							className={classes.game}
						>
							<Link
								href={`https://store.steampowered.com/app/${id}`}
								target='_blank'
							>
								{name}
							</Link>
						</li>
					))}
				</ul>
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

	componentDidMount() {

		this.removeMessageListener = steamService.onMessage(({
			game,
			done
		}) => {
			this.setState(({
				games
			}) => ({
				games:      !game ? games : [
					...games,
					game
				],
				inProgress: !done
			}));
		});

		this.removeExceptionListener = steamService.onException((error) => {
			this.setState(() => ({
				error:      error.message,
				games:      [],
				inProgress: false
			}));
		});
	}

	componentWillUnmount() {
		this.removeMessageListener();
		this.removeExceptionListener();
	}

	@Bind()
	onLinksChange(value: string, event: ChangeEvent<HTMLTextAreaElement>) {

		const {
			target
		} = event;
		const {
			validity
		} = target;
		const links = value.trim().split('\n').map(_ => _.trim()).filter(Boolean);

		switch (true) {

			case validity.valueMissing:
			default:
				target.setCustomValidity('');
				break;

			case links.length <= 1:
				target.setCustomValidity('You should provide minimum 2 links.');
				break;

			case links.length > maxLinksCount:
				target.setCustomValidity(`You should provide maximum ${maxLinksCount} links.`);
				break;

			case links.some(_ => !linkPattern.test(_)):
				target.setCustomValidity(`You should provide links to steam profiles. Example: ${linkExample}`);
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

		this.setState(() => ({
			games:      [],
			inProgress: true,
			error:      ''
		}));

		steamService.searchCommonGames(links);
	}
}
