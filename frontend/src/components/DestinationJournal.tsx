import React, { useEffect } from 'react'
import Navbar from './Navbar';
import {Journal} from '../services/Visited'
import { useParams } from 'react-router-dom';

const DestinationJournal = () => {
    const [journalEntries, setJournalEntries] = React.useState<[string, string][]>([]);
    const { name } = useParams<{ name: string }>();

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


  return (
    <div className="flex flex-col h-screen">
  <Navbar />
  <h2 className="text-lg font-semibold mb-4">Destination Journal</h2>
  <p className="text-gray-600">Keep track of your travel experiences and memories.</p>
  <p>
    Current Destination: <span className="font-bold">[Destination Name]</span>
  </p>
  <p>Journal Entries:</p>
  <ul>
    {journalEntries.map(([date, entry], index) => (
      <li key={index}>
        <strong>{date}:</strong> {entry}
      </li>
    ))}
  </ul>
</div>

)

}

export default DestinationJournal
