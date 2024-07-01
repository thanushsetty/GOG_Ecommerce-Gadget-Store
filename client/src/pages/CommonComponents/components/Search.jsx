import { useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Search = ({ handleSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const onSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const searchProducts = () => {
        handleSearch(searchQuery);
        setSearchQuery('');
    };

    return (
        <div className="header-search">
            <div className="header-search-left">
                <FontAwesomeIcon className="header-search-icon" icon={ faSearch } />
                <input
                    type="text"
                    placeholder="Search for Products"
                    value={ searchQuery }
                    onChange={ onSearchInputChange }
                />
            </div>
            <button onClick={ searchProducts }>Search</button>
        </div>
    );
};
