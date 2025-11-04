import { useState } from "react"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  className,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        icon="Search"
        iconPosition="left"
        className="pl-10"
        {...props}
      />
    </div>
  )
}

export default SearchBar