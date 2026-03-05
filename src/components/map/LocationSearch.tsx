"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

interface SearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

interface LocationSearchProps {
    onSelectLocation: (lat: number, lng: number, displayName: string) => void;
}

export default function LocationSearch({ onSelectLocation }: LocationSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                        query
                    )}&format=json&limit=5`
                );
                const data = await response.json();
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error("Failed to fetch location data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimeout = setTimeout(fetchResults, 500);
        return () => clearTimeout(debounceTimeout);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        setQuery(result.display_name);
        setIsOpen(false);
        onSelectLocation(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
    };

    return (
        <div ref={containerRef} className="relative w-full z-[1000] mb-4">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-[var(--color-navy)]/30 p-2 shadow-lg group focus-within:border-[var(--color-accent)] transition-colors">
                <Search className="text-[var(--color-navy)] w-5 h-5 ml-2 absolute" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    placeholder="Search location (Example: Bengaluru, Delhi, Mumbai)"
                    className="w-full bg-transparent pl-10 pr-4 py-2 text-[var(--color-navy)] font-bold placeholder-[var(--color-navy)]/50 focus:outline-none uppercase tracking-wider text-sm"
                />
                {isLoading && (
                    <Loader2 className="animate-spin text-[var(--color-accent)] w-5 h-5 mr-3 absolute right-0" />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border-2 border-[var(--color-navy)] shadow-[4px_4px_0px_var(--color-navy)] max-h-60 overflow-y-auto">
                    {results.map((result) => (
                        <button
                            key={result.place_id}
                            onClick={() => handleSelect(result)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-start gap-3 border-b border-slate-200 last:border-0 transition-colors"
                        >
                            <MapPin className="w-4 h-4 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                            <div className="flex flex-col flex-1">
                                <span className="text-sm font-bold text-[var(--color-navy)] line-clamp-1">
                                    {result.display_name.split(",")[0]}
                                </span>
                                <span className="text-xs text-slate-500 line-clamp-1">
                                    {result.display_name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
