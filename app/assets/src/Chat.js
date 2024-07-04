import { useEffect, useState } from 'react'
import {
	HandThumbDownIcon,
	ChatBubbleLeftEllipsisIcon,
	HandThumbUpIcon,
	ArrowPathIcon
} from '@heroicons/react/24/outline';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import Alert from './Alert';

const sillyPhrases = bsf_bot_localizer.sily_phrase;
const exampleQuestions = bsf_bot_localizer.example_questions;
const randomQuestionsSection = bsf_bot_localizer.random_que_section;
const randomQuestions = bsf_bot_localizer.random_que;

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
		const page = source.page ? ` Page ${source.page}` : '';

		return (
			<div className="relative flex flex-row items-center space-x-3 rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
				<span className="inline-flex items-center justify-center">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M8.23199 8.23093C9.13912 7.32386 10.3602 6.80016 11.6426 6.76815C12.925 6.73613 14.1707 7.19826 15.122 8.05893L15.303 8.23093L18.131 11.0599C19.052 11.9826 19.5763 13.2285 19.592 14.5321C19.6077 15.8357 19.1136 17.0939 18.215 18.0385C17.3165 18.9831 16.0845 19.5393 14.7818 19.5887C13.479 19.6381 12.2085 19.1768 11.241 18.3029L11.061 18.1309L8.93898 16.0089C8.75964 15.829 8.65551 15.5875 8.64776 15.3335C8.64 15.0796 8.7292 14.8322 8.89723 14.6417C9.06527 14.4511 9.29954 14.3316 9.55246 14.3075C9.80538 14.2834 10.058 14.3565 10.259 14.5119L10.353 14.5949L12.475 16.7169C13.0251 17.2702 13.769 17.5874 14.5491 17.6013C15.3292 17.6152 16.084 17.3246 16.6534 16.7913C17.2228 16.2579 17.562 15.5237 17.5991 14.7444C17.6362 13.9651 17.3682 13.202 16.852 12.6169L16.717 12.4739L13.889 9.64593C13.6104 9.3673 13.2797 9.14628 12.9157 8.99548C12.5516 8.84469 12.1615 8.76707 11.7675 8.76707C11.3735 8.76707 10.9833 8.84469 10.6193 8.99548C10.2553 9.14628 9.92457 9.3673 9.64598 9.64593C9.45834 9.83344 9.2039 9.93873 8.93863 9.93863C8.67336 9.93854 8.41899 9.83307 8.23148 9.64543C8.04398 9.45779 7.93869 9.20335 7.93878 8.93808C7.93888 8.67281 8.04434 8.41844 8.23199 8.23093ZM1.86799 1.86693C2.77512 0.959865 3.99618 0.436161 5.27861 0.404147C6.56105 0.372132 7.80673 0.834257 8.75799 1.69493L8.93898 1.86693L11.06 3.98993C11.2393 4.16989 11.3435 4.41137 11.3512 4.66532C11.359 4.91927 11.2698 5.16665 11.1017 5.35721C10.9337 5.54778 10.6994 5.66724 10.4465 5.69133C10.1936 5.71542 9.94098 5.64234 9.73998 5.48693L9.64598 5.40393L7.52498 3.28293C6.97395 2.73549 6.23207 2.42311 5.45542 2.41151C4.67877 2.3999 3.92789 2.68998 3.36075 3.22072C2.79361 3.75146 2.45443 4.48147 2.41456 5.25719C2.37469 6.03291 2.63725 6.79385 3.14698 7.37993L3.28199 7.52393L6.11098 10.3529C6.67357 10.9153 7.43649 11.2313 8.23199 11.2313C9.02748 11.2313 9.7904 10.9153 10.353 10.3529C10.4458 10.26 10.5561 10.1863 10.6774 10.136C10.7987 10.0857 10.9288 10.0598 11.0601 10.0597C11.1915 10.0597 11.3216 10.0855 11.4429 10.1357C11.5643 10.186 11.6746 10.2596 11.7675 10.3524C11.8604 10.4453 11.9341 10.5555 11.9844 10.6768C12.0347 10.7982 12.0606 10.9282 12.0607 11.0596C12.0607 11.1909 12.0349 11.321 11.9847 11.4424C11.9345 11.5637 11.8608 11.674 11.768 11.7669C10.8609 12.674 9.63979 13.1977 8.35735 13.2297C7.07492 13.2617 5.82925 12.7996 4.87799 11.9389L4.69598 11.7669L1.86799 8.93793C0.93063 8.00029 0.404053 6.72875 0.404053 5.40293C0.404053 4.07711 0.93063 2.80457 1.86799 1.86693Z" fill="#5C2DDD"/>
					</svg>
				</span>
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
			<div className="mx-auto px-6 text-center lg:px-8">
				<h2 className="text-left text-3xl font-bold tracking-tight text-[#492CDD] sm:text-4xl">
					{ `Ask Me Anything About ${bsf_bot_localizer.product_name}.` }
				</h2>
				<div className="mt-12 flex flex-col gap-4 max-[600px]:mt-8">
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
							className=""
							onSubmit={(e) => {
								e.preventDefault()
								askQuestion()
							}}
							disabled={loading}
						>
							<div className="mt-1 w-full rounded-md sm:flex bdb-search-wrapper">
								<div className="relative flex w-full flex-grow items-stretch max-[600px]:shadow-sm bdb-search-inner-wrap">
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
										className="bsf-docs-bot-input block w-full rounded-md max-[600px]:border-gray-300 py-4 pl-4 pr-10 text-sm focus:outline-none sm:rounded-none sm:rounded-l-md sm:py-0 sm:pl-6 sm:pr-12 sm:text-md"
										placeholder={ `What do you want to know about ${bsf_bot_localizer.product_name}?` }
									/>
									{
										randomQuestionsSection && (
											<button
												className="bsf-bot-random-cta absolute inset-y-0 right-0 flex items-center px-4"
												title="Random Question"
												tabIndex={3}
												onClick={(e) => {
													e.preventDefault()
													//insert a random question
													setQuestion(
														randomQuestions[
															Math.floor(Math.random() * randomQuestions.length)
														]
													)
												}}
											>
												<ArrowPathIcon className="h-4 w-4 text-gray-400 hover:rotate-12 hover:brightness-110 active:brightness-110 sm:h-6 sm:w-6" />
												<span className="ml-1 hidden text-gray-500 lg:block">
													Random
												</span>
											</button>
										)
									}
								</div>
								<button
									type="submit"
									tabIndex={2}
									className="bsf-bot-ask-cta shadow relative mt-4 inline-flex w-full items-center justify-center space-x-2 rounded-md bg-[#5C2DDD] text-sm font-bold text-white hover:bg-[#5C2DDD] hover:text-white focus:outline-none sm:-ml-px sm:mt-0 sm:w-32 sm:rounded-md sm:text-lg"
								>
									Ask
								</button>
							</div>

							<div className='mt-4 text-left suggestions-wrapper'>
								<span className='popular-questions-wrapper'>
									<span className='text-sm font-semibold'> Popular Questions: </span>
									{
										exampleQuestions.map((question, index) => (
											<button
												key={index}
												className='an-popular-question text-[#8478CD] hover:text-[#8478CD] bg-[#EDEAFF] hover:bg-[#EDEAFF] border-none text-xs rounded-sm py-1 px-2'
												onClick={() => {
													setQuestion(question);
													askQuestion();
												}}
											>
												{question}
											</button>
										))
									}
								</span>
							</div>
						</form>
					)}

					{!resultHtml }
				</div>

				{resultHtml && (
					<>
						<div className="relative mt-12 rounded-sm p-5 bg-[#F6FAFE] border border-solid border-[#E2E8F0] text-left shadow-sm sm:rounded-lg">
							{answerId && (
								<div className="flex items-center justify-end space-x-2 pb-4 pr-4 absolute right-3 top-3">
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
							<div className="min-w-full">
								<span className="font-semibold">Answer:</span>
								<div
									dangerouslySetInnerHTML={{ __html: resultHtml }}
									className="wpchat-code prose mt-3"
								/>
							</div>
						</div>

						{sources?.length > 0 && (
							<div className="relative text-left mt-8 pt-1 grid grid-cols-1 gap-4">
								<div className="font-semibold">
									Sources:
								</div>
								<div className='flex gap-3 flex-col'>
									{sources.map((source, index) => (
										<Source key={index} source={source} />
									))}
								</div>
								<p className="mt-8 text-sm text-gray-700 bdb-support-description">
									{bsf_bot_localizer.after_text}
								</p>
								<p className='mb-0'>
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
