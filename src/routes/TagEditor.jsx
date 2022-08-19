import { useEffect, useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getUserTags, uploadUserTags } from '../utils/firebase';

const TagEditor = _ => {
	const { user } = useUser();
	const [tags, setTags] = useState(null);

	useEffect(() => {
		const saveUserTags = async _ => {
			const tags = await getUserTags(user.uid);	

			setTags(tags[0]);
		};

		saveUserTags();

	}, []);

	const handleTagSave = (newTag) => {
		const newTags = {...tags};

		newTags.nodes = newTags.nodes.map(tag => (tag.id === newTag.id) ? newTag : tag)
		setTags(newTags);
	};

	const handleTagDelete = (deletedTag) => {
		const newTags = {...tags};
		newTags.nodes = newTags.nodes.filter(tag => tag.id !== deletedTag.id);

		setTags(newTags);
	};

	return (
		<div className='px-16 container'>
			<p className='text-3xl font-bold mb-3'>Your Tags</p>

			{
				tags ?
				<div>
					<p className='capitalize'>{ tags.name }</p>

					{ 
						tags.nodes.map((tag) => 
							<Tag 
								key={ tag.id } 
								tag={ tag } 
								onSave={ handleTagSave } 
								onDelete={ handleTagDelete } 
							/>
						)
					}

					<button 
						className='bg-light-secondary text-dark px-2'
						onClick={ () => setTags({ ...tags, nodes: [...tags.nodes, { name: '', parent: '', id: tags.nodes.length }] }) }
					>New tag</button>
				</div> :
				<button 
					className='bg-light-secondary text-dark px-2'
					onClick={ () => setTags({ name: 'genre', userId: user.uid, nodes: [{ name: '', parent: '', id: 0 }] }) }
				>New tag</button>
			}

			<button 
				className='bg-light-secondary text-dark px-2'
				onClick={ () => tags && uploadUserTags(tags) }
			>Upload changes</button>
		</div>
	);
}

const Tag = ({ tag, onSave, onDelete }) => {
	const [edit, setEdit] = useState(false);
	const tagNameRef = useRef();
	const tagParentRef = useRef();

	return(
		<div key={ tag.name } className='flex hover:bg-dark-secondary'>
			{ 
				!edit ?
					<p className='w-[200px]'>Name: { tag.name }</p> :
					<input type='text' id='name' className='w-[200px] text-dark' defaultValue={ tag.name } ref={ tagNameRef } />
			}

			{ 
				!edit ? 
					tag.parent && <p>Parent: { tag.parent }</p>	:
					<input type='text' id='parent' className='ml-2 text-dark' defaultValue={ tag.parent } ref={ tagParentRef } />
			}

			<button 
				className='bg-light-secondary text-dark ml-10 px-2'
				onClick={ () => {
					setEdit(!edit);
					if(edit) {
						onSave({id: tag.id, name: tagNameRef.current.value, parent: tagParentRef.current.value});
					}
				}}
			>{ edit? 'Save' : 'Edit' }</button>

			<button 
				className='bg-light-secondary text-dark ml-10 px-2'
				onClick={ () => onDelete(tag) }
			>Delete</button>

		</div>
	);
}

export default TagEditor;