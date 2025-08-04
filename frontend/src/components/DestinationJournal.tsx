import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Journal, UpdateJournal } from '../services/Visited';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react'; 

const DestinationJournal = () => {
    const [journalEntries, setJournalEntries] = useState<[string, string][]>([]);
    const { name } = useParams<{ name: string }>();
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJournalEntries = async () => {
            try {
                if (!name) throw new Error('No destination name provided');
                const entries = await Journal(name);
                setJournalEntries(entries);
            } catch (error) {
                console.error('Error fetching journal entries:', error);
            }
        };
        fetchJournalEntries();
    }, [name]);

    const handleUpdateJournal = async () => {
        const journal = journalEntries[0][1];
        if (!name || !journal) {
            console.error('Name or journal content is missing');
            return;
        }
        try {
            if (!name) throw new Error('No destination name provided');
            await UpdateJournal(name, journal);
            setEdit(false);
        } catch (error) {
            console.error('Error updating journal:', error);
        }
    };



    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <div className="flex justify-between items-start mx-10 mt-4">
              <button onClick={() => navigate('/map')} className="bg-amber-500 text-white px-4 py-2 rounded-md translate-x-[20%]">
                Return to Map
              </button>
              </div>
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-amber-800 mb-2">Travel Journal</h1>
                    <p className="text-amber-600 italic">Document your adventures and cherish the memories</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-amber-400">
                    <h2 className="text-2xl font-serif text-amber-900 mb-4">
                        Currently Exploring: <span className="font-bold underline">{name || 'Unknown Destination'}</span>
                    </h2>
                    
                    {journalEntries.length === 0 ? (
                        <div className="relative">
                            An error has occured. Please return to map, reload and try again.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {journalEntries.map(([place, journal], index) => (
                            <div key={index} className="border-b border-amber-100 pb-6 last:border-0 last:pb-0">
                                <div className="text-sm text-amber-600 mb-4 underline decoration-amber-400">
                                My experiences at {place}
                                </div>
                                
                                {edit ? (
                                <div className="relative">
                                    <textarea 
                                    value={journal}
                                    onChange={(e) => {
                                        const newEntries = [...journalEntries];
                                        newEntries[index][1] = e.target.value;
                                        setJournalEntries(newEntries);
                                    }}
                                    className='
                                        border-l-4 border-amber-200 
                                        bg-amber-50  
                                        text-gray-700 
                                        rounded-none 
                                        p-4 
                                        w-full 
                                        focus:outline-none 
                                        focus:ring-1 focus:ring-amber-300 
                                        focus:bg-amber-50
                                        resize-none
                                        placeholder-amber-300
                                        leading-relaxed
                                        overflow-y-auto
                                        max-h-64
                                        whitespace-pre-wrap
                                    '
                                    rows={5}
                                    placeholder="Write your thoughts here..."
                                    />
                                </div>
                                ) : (
                                <div className="max-h-64 overflow-y-auto">
                                    <pre className="
                                    font-sans
                                    border-l-4 border-amber-200 
                                    bg-amber-50  
                                    text-gray-700 
                                    rounded-none 
                                    p-4 
                                    w-full 
                                    whitespace-pre-wrap
                                    leading-relaxed
                                    ">
                                    {journal}
                                    </pre>
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                    )}
                    <div className='flex justify-center mt-6'>
                        <button onClick={() => {setEdit(!edit); if (edit) handleUpdateJournal();}} className="bg-amber-500 text-white px-4 py-2 rounded-md">
                            {edit ? 'Save' : 'Edit'}
                        </button>
                    </div>
                </div>

                <div className="bg-amber-100 rounded-lg p-4 text-center">
                    <p className="text-amber-800">"The world is a book, and those who do not travel read only a page." — Saint Augustine</p>
                </div>
            </div>
        </div>
    );
};

export default DestinationJournal;