import React, { useEffect, useMemo, useRef, useState } from 'react';

// MUI Imports
import { Badge, Link, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Framer Motion Imports
import { AnimatePresence, motion } from 'framer-motion';

// Icon Imports
import { AlertCircle, ExternalLink } from 'lucide-react'; // Added ExternalLink icon
import RegionSelect from './components/RegionSelect';
import useDebounce from './debounce';

// --- Interface Definition ---
interface Municipality {
    Obcina: string;
    Povrsina: string;
    Prebivalci: string;
    Gostota: string;
    Naselja: string;
    Leto: string;
    Pokrajina: string;
    Statisticnaregija: string;
    OdcepitevOdkomuneobcine: string;
    url?: string;
}

// --- Municipality Card Component ---
const MunicipalityCard: React.FC<{ municipality: Municipality }> = React.memo(({ municipality }) => {
    const [showImage, setShowImage] = useState(true);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Mark as loaded to stop skeleton and show error
    };

    const toggleImage = () => {
        setShowImage((prevShowImage) => !prevShowImage);
        // Reset image state if hiding, so skeleton shows next time
        if (showImage) {
            setImageLoaded(false);
            setImageError(false);
        }
    };

    // Construct image URL - ensure filenames match the `obcina` property
    const imageUrl = `/municipalities/${municipality.Obcina.replaceAll(' ', '_')}/grb.png`;

    // Framer Motion Variants for smoother control
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }, // Slightly longer duration, smoother ease
    };

    const imageVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: "easeOut" } }, // Match duration/ease
        exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeIn" } },
    };

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card
                sx={{
                    // Modern Card Styles
                    backgroundColor: '#1e293b', // Darker shade than background
                    color: '#e2e8f0', // Light grey text
                    borderRadius: 2, // Increased border radius for softer look
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)', // More pronounced shadow
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth hover transition
                    '&:hover': {
                        transform: 'translateY(-5px)', // Lift card slightly on hover
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)', // Darker shadow on hover
                    },
                    display: 'flex', // Use flexbox for internal layout if needed
                    flexDirection: 'column',
                    cursor: 'pointer'
                }}
                onClick={toggleImage}
            >
                <CardHeader
                    title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="h6" component="div" sx={{ color: '#cbd5e1', fontWeight: 600 }}> {/* Lighter grey for title */}
                                {municipality.Obcina}
                            </Typography>
                            <Badge
                                sx={{
                                    backgroundColor: 'rgba(147, 197, 253, 0.15)', // Slightly more opaque
                                    color: '#93c5fd', // blue-300
                                    border: '1px solid rgba(147, 197, 253, 0.25)', // Slightly more opaque border
                                    padding: '4px 10px', // Slightly more padding
                                    borderRadius: '16px', // Pill shape
                                    fontSize: '0.8rem', // Slightly larger font
                                    fontWeight: 500,
                                    display: 'inline-flex', // Use flexbox for centering content in badge
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {municipality.Statisticnaregija}
                            </Badge>
                        </Box>
                    }
                    action={
                      <Link href={municipality.url} onClick={e => {e.stopPropagation()}} target="_blank">
                        <Button
                            size="small"
                            variant="outlined"
                            
                            endIcon={<ExternalLink size={16} />} // Slightly larger icon
                            aria-label='Več o občini'
                            sx={{
                                color: '#93c5fd', // blue-300
                                borderColor: '#93c5fd',
                                textTransform: 'none',
                                borderRadius: '20px', // Rounded button corners
                                '&:hover': {
                                    backgroundColor: 'rgba(147, 197, 253, 0.1)',
                                    borderColor: '#93c5fd',
                                },
                            }}
                        >
                            Več o občini
                        </Button>
                        </Link>
                    }
                    sx={{ pb: 1 }} // Reduced padding bottom
                />
                <CardContent sx={{ flexGrow: 1 }}> {/* Allow content to take available space */}

                    {/* Details Section */}
                    <Stack direction="row" spacing={2} sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                    <Stack spacing={1.5}> {/* Increased spacing */}
                        {/* Helper function or direct map could be used if more fields */}
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}> {/* Lighter grey text */}
                            <strong>Površina:</strong> {municipality.Povrsina} km²
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            <strong>Prebivalci:</strong> {municipality.Prebivalci}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            <strong>Gostota:</strong> {municipality.Gostota} /km²
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            <strong>Naselja:</strong> {municipality.Naselja}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            <strong>Leto ustanovitve:</strong> {municipality.Leto}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            <strong>Pokrajina:</strong> {municipality.Pokrajina}
                        </Typography>
                         <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            <strong>Odcepitev:</strong> {municipality.OdcepitevOdkomuneobcine || '-'}
                        </Typography>
                    </Stack>
                                        {/* Image Section */}
                                        <AnimatePresence>
                        {showImage && (
                            <motion.div
                                variants={imageVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="mb-4 overflow-hidden "
                                style={{ textAlign: 'center' }} // Center image horizontally
                            >
                                {imageError ? (
                                    <Alert severity="error" icon={<AlertCircle />} sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}> {/* Red-toned alert */}
                                        <AlertTitle sx={{ color: '#f87171' }}>Error Loading Emblem</AlertTitle>
                                        <Typography variant="body2">
                                            Failed to load emblem for {municipality.Obcina}.
                                        </Typography>
                                    </Alert>
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                                        {!imageLoaded && (
                                            <Skeleton
                                                variant="rectangular"
                                                width={100}
                                                height={100}
                                                sx={{ bgcolor: 'grey.700', borderRadius: 1 }}
                                            />
                                        )}
                                        <img
                                            ref={imageRef}
                                            src={imageUrl}
                                            alt={`Emblem of ${municipality.Obcina}`}
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                            style={{
                                                display: imageLoaded ? 'block' : 'none',
                                                opacity: imageLoaded && !imageError ? 1 : 0,
                                                transition: 'opacity 0.3s ease-in-out',
                                                width: '100%',
                                                maxWidth: '150px',
                                                height: 'auto',
                                                margin: 'auto', // Center using margin
                                                borderRadius: '8px', // Slight rounding on image
                                                objectFit: 'contain', // Ensure image fits without distortion
                                            }}
                                        />
                                    </Box>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </Stack>
                </CardContent>
            </Card>
        </motion.div>
    );
});

// --- Loading Skeleton Component ---
const LoadingSkeleton = () => {
    return (
        <Card sx={{ mb: 3, backgroundColor: 'grey.800', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}> {/* Consistent card styling */}
            <CardHeader
                 title={<Skeleton height={28} width="60%" sx={{ bgcolor: 'grey.700' }} />} // Wider title skeleton
                 action={<Skeleton height={36} width={100} sx={{ bgcolor: 'grey.700' }} />} // Taller action skeleton
                 sx={{ pb: 1 }}
            />
            <CardContent>
                <Skeleton height={24} width="40%" sx={{ bgcolor: 'grey.700', mb: 2, borderRadius: '12px' }} /> {/* Badge skeleton with rounding */}
                <Stack spacing={1.5}>
                    <Skeleton height={18} width="80%" sx={{ bgcolor: 'grey.700' }} />
                    <Skeleton height={18} width="55%" sx={{ bgcolor: 'grey.700' }} />
                    <Skeleton height={18} width="70%" sx={{ bgcolor: 'grey.700' }} />
                    <Skeleton height={18} width="50%" sx={{ bgcolor: 'grey.700' }} />
                    <Skeleton height={18} width="40%" sx={{ bgcolor: 'grey.700' }} />
                    <Skeleton height={18} width="65%" sx={{ bgcolor: 'grey.700' }} />
                    <Skeleton height={18} width="45%" sx={{ bgcolor: 'grey.700' }} />
                </Stack>
            </CardContent>
        </Card>
    );
};


// --- Main Page Component ---
const MunicipalitiesPage = () => {
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchEntry, setSearchEntry] = useState('');
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    // Use the debounced hook for the value you'll use for filtering/searching
    const debouncedSearchEntry = useDebounce(searchEntry, 300); // Adjust delay (ms) as needed
    const searchBar = useRef<HTMLInputElement>(null);
      useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault(); // Prevent the default browser search box
            searchBar.current?.focus();
            console.log('aseds')
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []); // Empty dependency array means this effect runs once on mount


      const filteredMunicipalities = useMemo(() => {      
        let currentMunicipalities = municipalities;
        if (debouncedSearchEntry) {
          currentMunicipalities = currentMunicipalities.filter(m =>
            m.Obcina.toLowerCase().includes(debouncedSearchEntry.toLowerCase())
          );
        }
      
        // Apply region filter if regions are selected
        if (selectedRegions.length > 0) {
          currentMunicipalities = currentMunicipalities.filter(m =>
            selectedRegions.includes(m.Pokrajina)
          );
        }
      
        return currentMunicipalities;
      
      }, [municipalities, debouncedSearchEntry, selectedRegions]); // Corrected dependencies


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/municipalities-data.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
                }
                const data: Municipality[] = await response.json();
                 // Optional: Sort municipalities alphabetically for better presentation
                const sortedData = data.sort((a, b) => a.Obcina.localeCompare(b.Obcina));
                setMunicipalities(sortedData);
            } catch (err: any) {
                console.error("Fetching error:", err);
                setError(err.message || "An unknown error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Common page container props
    const pageContainerProps = {
        className:"container mx-auto p-4 md:p-6",
        sx: { backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0' } // Ensure base text color is light
    };

    // Loading State
    if (loading) {
        return (
            <Box {...pageContainerProps}>
                 <Typography variant="h3" component="h1" sx={{
                    textAlign: 'center',
                    fontWeight: 700,
                    mb: 6,
                    color: '#ffffff', // White title during loading
                    textShadow: '0 0 8px rgba(147, 197, 253, 0.3)' // Subtle text shadow
                }}>
                    Slovenske občine
                </Typography>
                <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"> {/* More responsive grid and gap */}
                    {Array.from({ length: 12 }).map((_, i) => ( // Show more skeletons
                        <LoadingSkeleton key={`skeleton-${i}`} />
                    ))}
                </Box>
            </Box>
        );
    }

    // Error State
    if (error) {
        return (
            <Box {...pageContainerProps} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                 <Typography variant="h3" component="h1" sx={{
                    textAlign: 'center',
                    fontWeight: 700,
                    mb: 6,
                    color: '#ffffff',
                    textShadow: '0 0 8px rgba(147, 197, 253, 0.3)'
                }}>
                    Slovenske občine
                </Typography>
                <Alert severity="error" icon={<AlertCircle className="h-6 w-6" />} sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', maxWidth: 'md', width: '100%' }}>
                    <AlertTitle sx={{ color: '#f87171', fontWeight: 600 }}>Loading Error</AlertTitle>
                    <Typography variant="body1">
                         {error}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                         Please check the data source and try refreshing the page.
                    </Typography>
                </Alert>
            </Box>
        );
    }

    // Success State
    return (
        <Box {...pageContainerProps}>
             <Typography
                variant="h3" // Larger heading
                component="h1"
                sx={{
                   textAlign: 'center',
                   fontWeight: 700, // Bolder font
                   mb: 6, // Increased bottom margin
                   // Modern Gradient Text Effect
                   background: 'linear-gradient(to right, #60a5fa, #34d399)', // Blue to Green gradient
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   textShadow: '0 0 12px rgba(147, 197, 253, 0.5)', // Subtle glow effect
                }}
            >
                Slovenske občine
            </Typography>
            <TextField
                fullWidth
                label="Filtriraj občine"
                variant="outlined"
                onChange={e => setSearchEntry(e.target.value)}
                ref={searchBar}
              />
            <RegionSelect onChange={e => setSelectedRegions([...e])}></RegionSelect>
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"> {/* Improved responsive grid and gap */}
                <AnimatePresence> {/* Enable exit animations */}
                  <Stack gap={4}>
                    {filteredMunicipalities.map((municipality) => (
                        <MunicipalityCard key={municipality.Obcina} municipality={municipality} />
                    ))}
                    </Stack>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default MunicipalitiesPage;