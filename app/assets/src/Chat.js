import { useEffect, useState } from 'react'
import {
	HandThumbDownIcon,
	ChatBubbleLeftEllipsisIcon,
	DocumentTextIcon,
	HandThumbUpIcon,
	LinkIcon,
	ArrowPathIcon
} from '@heroicons/react/24/outline';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import Alert from './Alert';

const sillyPhrases = bsf_bot_localizer.sily_phrase;

const exampleQuestions = bsf_bot_localizer.random_que;

export default function Chat() {
	const [question, setQuestion] = useState('')
	const [answer, setAnswer] = useState('')
	const [answerId, setAnswerId] = useState(null)
	const [resultHtml, setResultHtml] = useState('')
	const [sources, setSources] = useState([])
	const [loading, setLoading] = useState(false)
	const [loadingPhrase, setLoadingPhrase] = useState(sillyPhrases[0])
	const [errorText, setErrorText] = useState(null)
	const [rating, setRating] = useState(0)

	//clear error text when question changes
	useEffect(() => {
		if (question) {
			setErrorText(null)
		}
	}, [question])

	//convert markdown to html when answer changes or is appended to
	useEffect(() => {
		if (answer) {
			remark()
			.use(html)
			.use(remarkGfm)
			.process(answer)
			.then((html) => {
				setResultHtml(html.toString())
			})
		}
	}, [answer])

	// make api call to ask question
	const askQuestion = async () => {
		if (!question || question.length < 10) {
			setErrorText('Please enter a full question.')
			return
		}
		setLoading(true)
		setErrorText(null)
		setAnswer('')
		setResultHtml('')
		setSources([])
		setRating(0)
		setAnswerId(null)

		const data = { question: question, format: 'markdown' }

		//get apiBase from env
		const apiUrl = `wss://api.docsbot.ai/teams/${bsf_bot_localizer.team_id}/bots/${bsf_bot_localizer.bot_id}/chat`
		const ws = new WebSocket(apiUrl)

		// Send message to server when connection is established
		ws.onopen = function (event) {
			ws.send(JSON.stringify(data))
		}

		ws.onerror = function (event) {
			console.log('error', event)
			setErrorText('There was a connection error. Please try again.')
			setLoading(false)
		}

		ws.onclose = function (event) {
			if (!event.wasClean) {
			setErrorText('Network error, please try again.')
			setLoading(false)
			}
		}

		// Receive message from server word by word. Display the words as they are received.
		ws.onmessage = function (event) {
			const data = JSON.parse(event.data)
			if (data.sender === 'bot') {
			if (data.type === 'start') {
			} else if (data.type === 'stream') {
				//append to answer
				setAnswer((prev) => prev + data.message)
			} else if (data.type === 'info') {
			} else if (data.type === 'end') {
				const finalData = JSON.parse(data.message)
				setSources(finalData.sources)
				setAnswer(finalData.answer)
				setAnswerId(finalData.id)
				setLoading(false)
				ws.close()
			} else if (data.type === 'error') {
				setErrorText(data.message)
				setLoading(false)
				ws.close()
			}
			}
		}
	}

	//set random loading phrase
	useEffect(() => {
		//set random phrase on loading
		if (loading) {
			setLoadingPhrase(
			sillyPhrases[Math.floor(Math.random() * sillyPhrases.length)]
			)
		}
	}, [loading])

	//trigger api call when rating changes
	useEffect(() => {
		if (rating) {
			rateAnswer(rating)
		}
	}, [rating])

	// make api call to rate
	const rateAnswer = async (newRating) => {
		if (!answerId) {
			return
		}

		setErrorText(null)

		const data = { rating: newRating }

		const headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		}

		const apiUrl = `https://api.docsbot.ai/teams/${bsf_bot_localizer.team_id}/bots/${bsf_bot_localizer.bot_id}/rate/${answerId}`
		try {
			const response = await fetch(apiUrl, {
			method: 'PUT',
			headers,
			body: JSON.stringify(data),
			})
			if (response.ok) {
			const data = await response.json()
			//if trimmed answer is empty, show error
			if (data.error) {
				setErrorText(data.error)
			}
			} else {
			try {
				const data = await response.json()
				setErrorText(data.error || 'Something went wrong, please try again.')
			} catch (e) {
				setErrorText('Something went wrong, please try again.')
			}
			setLoading(false)
			}
		} catch (e) {
			console.warn(e)
			setErrorText('Something went wrong, please try again.')
			setLoading(false)
		}
	}

	const Source = ({ source }) => {
		const SourceIcon = source.url ? LinkIcon : DocumentTextIcon;
		const page = source.page ? ` Page ${source.page}` : '';

		return (
			<div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
				<div className="flex-shrink-0">
					<span className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-600 p-3 shadow-lg">
					<SourceIcon className="h-6 w-6 text-white" aria-hidden="true" />
					</span>
				</div>
				<div className="min-w-0 flex-1">
					{source.url ? (
					<a
						href={source.url}
						target="_blank"
						className="focus:outline-none"
					>
						<span className="absolute inset-0" aria-hidden="true" />
						<p className="text-left text-sm font-medium text-gray-900 mb-0">
						{source.title}
						{page}
						</p>
					</a>
					) : (
					<p className="text-left text-sm font-medium text-gray-900 mb-0">
						{source.title || source.url}
						{page}
					</p>
					)}
				</div>
			</div>
		)
	}

	return (
		<div id="ask" className="relative">
			<div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
				<div>
					<span className="text-lg font-semibold text-fuchsia-600">Let's chat</span>
					<h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						{ `Ask me about ${bsf_bot_localizer.product_name}` }
					</h2>
					<p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
						{ `Feel free to ask me anything about ${bsf_bot_localizer.product_name} and I'll do my best to provide accurate information based on my sources.` }
					</p>
				</div>
				<div className="mt-12">
					<Alert title={errorText} type="warning" />
					{loading ? (
					<>
						<div className="mt-6 flex justify-center">
						<div className="relative w-20">
							<ChatBubbleLeftEllipsisIcon className="absolute m-6 h-8 w-8 animate-pulse text-indigo-500" />
							<div className="h-20 w-20 rounded-full border-2 border-indigo-400"></div>
							<div className="absolute left-0 top-0 h-20 w-20 animate-spin rounded-full border-t-4 border-fuchsia-600"></div>
						</div>
						</div>
						<blockquote
							className="mt-2 text-center text-sm text-fuchsia-800"
							title="AI-generated loading phrase"
						>
						"{loadingPhrase}"
						</blockquote>
					</>
					) : (
					<form
						className="flex justify-center"
						onSubmit={(e) => {
						console.log('submit')
						askQuestion()
						e.preventDefault()
						}}
						disabled={loading}
					>
						<div className="mt-1 w-full rounded-md sm:flex sm:shadow-sm">
						<div className="relative flex w-full flex-grow items-stretch shadow-sm sm:shadow-inherit">
							<input
								type="text"
								name="query"
								id="query"
								value={question}
								maxLength={200}
								minLength={10}
								required
								onChange={(e) => setQuestion(e.target.value)}
								onKeyDown={(e) => {
									//submit on enter
									if (e.key === 'Enter') {
									askQuestion()
									}
								}}
								tabIndex={1}
								autoComplete="off"
								className="bsf-docs-bot-input block w-full rounded-md border-gray-300 py-4  pl-4 pr-10 text-sm focus:outline-none sm:rounded-none sm:rounded-l-md sm:py-0 sm:pl-6 sm:pr-12 sm:text-lg"
								placeholder={ `What do you want to know about ${bsf_bot_localizer.product_name}` }
							/>
							<button
								className="bsf-bot-random-cta absolute inset-y-0 right-0 flex items-center px-4"
								title="Random Question"
								tabIndex={3}
								onClick={(e) => {
									e.preventDefault()
									//insert a random question
									setQuestion(
									exampleQuestions[
										Math.floor(Math.random() * exampleQuestions.length)
									]
									)
								}}
							>
								<ArrowPathIcon className="h-4 w-4 text-gray-400 hover:rotate-12 hover:brightness-110 active:brightness-110 sm:h-6 sm:w-6" />
								<span className="ml-1 hidden text-gray-500 lg:block">
									Random
								</span>
							</button>
						</div>
						<button
							type="submit"
							tabIndex={2}
							className="bsf-bot-ask-cta shadow relative mt-4 inline-flex w-full items-center justify-center space-x-2 rounded-md bg-[#492cdd] py-3 px-4 text-sm font-bold text-white hover:bg-[#492cdd] hover:text-white focus:outline-none sm:-ml-px sm:mt-0 sm:w-32 sm:rounded-none sm:rounded-r-md sm:text-lg"
						>
							Ask
						</button>
						</div>
					</form>
					)}

					{!resultHtml }
				</div>

				{resultHtml && (
					<>
						<div className="relative mt-16 rounded-sm bg-white text-left shadow-sm sm:rounded-lg ">
							<div className="absolute -inset-6 flex h-12 items-center text-2xl font-extrabold tracking-tighter text-gray-800 opacity-25">
								<svg
									className="mr-2 h-8 w-8"
									fill="currentColor"
									viewBox="0 0 32 32"
									aria-hidden="true"
								>
									<path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
								</svg>
								Answer:
							</div>
							<div
								className="wpchat-code prose min-w-full p-4 pb-2 sm:p-8 sm:pb-4"
								dangerouslySetInnerHTML={{ __html: resultHtml }}
							/>
							{answerId && (
								<div className="flex items-center justify-end space-x-2 pb-4 pr-4">
									<button
										type="button"
										onClick={() => setRating(1)}
										disabled={rating === 1}
										className="rounded-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:text-fuchsia-600 bsf-bot-thumbs-reaction"
									>
										<span className="sr-only">Downvote</span>
										<HandThumbUpIcon className="h-6 w-6" aria-hidden="true" />
									</button>
									<button
										type="button"
										onClick={() => setRating(-1)}
										disabled={rating === -1}
										className="rounded-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:text-fuchsia-600 bsf-bot-thumbs-reaction"
									>
										<span className="sr-only">Upvote</span>
										<HandThumbDownIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
							)}
						</div>

						{sources?.length > 0 && (
							<div className="relative mt-16 pt-1">
								<div className="absolute -inset-6 ml-8 flex h-12 items-center text-2xl font-extrabold tracking-tighter text-gray-800 opacity-25">
									Sources:
								</div>
								<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
									{sources.map((source, index) => (
										<Source key={index} source={source} />
									))}
								</div>
								<p className="mt-12 text-sm text-gray-700">
									{bsf_bot_localizer.after_text}
								</p>
								<p className='pb-2'>
									<a
										href={bsf_bot_localizer.support_link}
										target='_blank'
										className="ast-button"
									>
										Submit a Ticket
									</a>
								</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}
