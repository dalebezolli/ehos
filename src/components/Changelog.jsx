import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getChangelog } from '../utils/firebase';

const Changelog = ({ onCancel }) => {
	const [ log, setLog ] = useState(null);
	const { lastChangelogDate, setLastChangelogDate, lastChangelog, setLastChangelog } = useUser();
	const isLoadedRef = useRef(false);

	useEffect(() => {
		const saveChangelogs = async _ => {
			const log = await getChangelog(lastChangelogDate);
			if(log === null ) return;
			const newLastChangelog = log.id;

			if(lastChangelog === newLastChangelog) {
				onCancel();
			}
			setLastChangelogDate(new Date().toLocaleDateString());
			setLastChangelog(newLastChangelog);
			setLog(log.data());
		}

		if(!isLoadedRef.current) {
			isLoadedRef.current = true;
			return;
		}

		saveChangelogs();
	}, []);

	if(!log) return;

	return (
		<div className='
					fixed w-screen h-screen top-0 left-0 z-100 
					bg-[#000000af] text-dark
		'>
			<div className='
				absolute w-[600px] p-6
				bg-light-secondary top-1/2 left-1/2
				-translate-y-1/2 -translate-x-1/2
				rounded-lg
			'>
				<div className='flex justify-between mb-8'>
					<h2 className='font-bold text-xl'>Changelog</h2>
					<button onClick={ onCancel }>Exit</button>
				</div>

				<div >
					<h3 className='font-bold text-lg mb-2'>Update { 
						new Date(log.date.seconds * 1000).toLocaleDateString()
					}</h3>
					{
						log.changes.length !== 0 && log.changes.map(changes =>
							<div className='mb-4' key={ changes.title }>
								<h3 className='font-bold text-lg capitalize mb-2'>- { changes.title }</h3>
								<ul>
									{
										changes.description !== 0 && (
											changes.description.map((entry, index) =>
												<li className='normal-case' key={ index }>{ entry }</li>
											)
										)
									}
								</ul>
							</div>
						)
					}
				</div>
			</div>
		</div>
	);
};

export default Changelog;