import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Post from '@structures/post';
import User from '@structures/user';
import ArrowIcon from './ArrowIcon';
import '@scss/VoteSelector.scss';

interface Props {
	user: User | null;
	post: Post;
	setFailed: Dispatch<SetStateAction<boolean>>;
}

const VoteSelector: React.FC<Props> = ({ user, post, setFailed }) => {
	const busy = useRef(false);
	const [status, setStatus] = useState<number>(0);
	const [votes, setVotes] = useState(post.upvotes - post.downvotes);

	useEffect(() => {
		if (!user) return;
		busy.current = true;

		axios
			.get(`/api/posts/${post.id}/votestatus`)
			.then(res => setStatus(res.data.voteStatus))
			.catch(err => {
				console.error(err);
				setFailed(true);
			})
			.finally(() => {
				busy.current = false;
			});
	}, [user, post, setFailed]);

	const vote = async (vote: 'upvote' | 'downvote') => {
		if (busy.current) return;

		busy.current = true;
		try {
			const res = await axios.post(`/api/posts/${post.id}/${vote}`);
			const { newStatus } = res.data;

			setVotes(votes => votes - (status - newStatus));
			setStatus(newStatus);
		} catch (err) {
			console.error(err);
		} finally {
			busy.current = false;
		}
	};

	return (
		<div className="d-flex align-items-center">
			<ArrowIcon
				onClick={() => vote('upvote')}
				gray={!user}
				size={20}
				direction="up"
			/>
			<p className="my-0 mx-2">{votes}</p>
			<ArrowIcon
				onClick={() => vote('downvote')}
				gray={!user}
				size={20}
				direction="down"
			/>
		</div>
	);
};

export default VoteSelector;
