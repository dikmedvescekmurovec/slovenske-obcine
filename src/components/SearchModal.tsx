import CloseIcon from '@mui/icons-material/Close'; // Import a close icon
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';

// Define the styles using a type for clarity (though not strictly required by MUI's sx prop)
const style: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, // Adjust width as needed
  backgroundColor: 'background.paper', // Note: In TSX with sx, this often uses theme values
  borderRadius: 8, // Pixels or theme value
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Example box-shadow
  padding: 32, // Example padding in pixels or theme value
  display: 'flex',
  flexDirection: 'column',
  gap: 16, // Example spacing in pixels or theme value
};

// Define props type for the component (optional if no props)
interface SearchModalProps {
  onChange: (search: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Specify the type of the HTML element the ref will hold
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Effect to handle the Ctrl + F key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl + F (or Cmd + F on macOS)
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault(); // Prevent the default browser search box
        setIsOpen(true);
      }

      // Close the modal if Escape is pressed
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Effect to focus the search input when the modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Use a small delay to ensure the modal is fully rendered before focusing
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus(); // Use optional chaining as ref might be null
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]); // Rerun this effect when isOpen changes

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle search input changes here
    props.onChange(event.target.value);
    // You would typically pass this value up to a parent component
    // or use a state management solution to perform the search.
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="search-modal-title"
    >
      {/* Use the sx prop for MUI system styling */}
      <Box sx={{
        position: 'absolute' as const, // Type assertion for literal union type
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="search-modal-title" variant="h6" component="h2">
            Search
          </Typography>
          <IconButton onClick={handleCloseModal} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          label="Enter search term..."
          variant="outlined"
          inputRef={searchInputRef}
          onChange={handleSearchInputChange}
          autoFocus
          value={props.initValue}
          // You can add value prop here if you manage input state internally
          // value={searchValue}
        />
        {/* Add search results or other content here within the Box */}
      </Box>
    </Modal>
  );
};

export default SearchModal;