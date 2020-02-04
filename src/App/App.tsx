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
const linksPlaceholder = `
https://steamcommunity.com/id/molotoko
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
							{name}
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
		const links = value.trim().split('\n').map(_ => _.trim()).filter(Boolean);
		const isValid = links.every(_ => linkPattern.test(_))
			&& links.length > 1
			&& links.length <= maxLinksCount;

		if (isValid) {
			target.setCustomValidity('');
		} else {
			target.setCustomValidity('Invalid links.');
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
