export function formatDate(dateString: string, showYear = false) {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
        year: showYear ? 'numeric' : undefined,
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
}