import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { searchCities, type SelectedCity } from '../../lib/geocoding'

type CityAutocompleteProps = {
  label: string
  value: string
  selectedCity: SelectedCity | null
  onValueChange: (value: string) => void
  onCitySelect: (city: SelectedCity) => void
  onCityClear: () => void
  disabled?: boolean
  required?: boolean
}

export function CityAutocomplete({
  label,
  value,
  selectedCity,
  onValueChange,
  onCitySelect,
  onCityClear,
  disabled = false,
  required = false,
}: CityAutocompleteProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<SelectedCity[]>([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (selectedCity && value === selectedCity.displayLabel) {
      setSuggestions([])
      setOpen(false)
      return
    }

    const trimmed = value.trim()
    if (trimmed.length < 3) {
      setSuggestions([])
      setOpen(false)
      setSearchError(null)
      return
    }

    let cancelled = false
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true)
        setSearchError(null)

        try {
          const results = await searchCities(trimmed)
          if (!cancelled) {
            setSuggestions(results)
            setOpen(results.length > 0)
            setActiveIndex(-1)
          }
        } catch (error) {
          if (!cancelled) {
            setSuggestions([])
            setOpen(false)
            setSearchError(
              error instanceof Error ? error.message : 'Ошибка поиска города.',
            )
          }
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      })()
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [value, selectedCity])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value
    onValueChange(nextValue)

    if (selectedCity && nextValue !== selectedCity.displayLabel) {
      onCityClear()
    }
  }

  function handleSelect(city: SelectedCity) {
    onCitySelect(city)
    setSuggestions([])
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % suggestions.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1))
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      handleSelect(suggestions[activeIndex]!)
    }

    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="city-autocomplete" ref={rootRef}>
      <label className="input-field" htmlFor={listId}>
        <span className="input-field__label">{label}</span>
        <input
          id={listId}
          className="input-field__input"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setOpen(true)
            }
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${listId}-listbox`}
          aria-autocomplete="list"
          disabled={disabled}
          required={required}
          placeholder="Начните вводить город (минимум 3 символа)"
        />
      </label>

      {loading ? <p className="city-autocomplete__hint">Поиск городов…</p> : null}
      {searchError ? <p className="city-autocomplete__error">{searchError}</p> : null}
      {!selectedCity && value.trim().length >= 3 && !loading && suggestions.length === 0 ? (
        <p className="city-autocomplete__hint">Города не найдены. Уточните запрос.</p>
      ) : null}
      {selectedCity ? (
        <p className="city-autocomplete__selected">
          Выбран: {selectedCity.displayLabel} · {selectedCity.timezone}
        </p>
      ) : null}

      {open && suggestions.length > 0 ? (
        <ul
          id={`${listId}-listbox`}
          className="city-autocomplete__list"
          role="listbox"
        >
          {suggestions.map((city, index) => (
            <li key={city.id}>
              <button
                type="button"
                className={`city-autocomplete__option${
                  index === activeIndex ? ' city-autocomplete__option--active' : ''
                }`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(city)}
              >
                {city.displayLabel}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
