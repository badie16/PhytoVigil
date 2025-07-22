export class DateUtils {
    static formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    static formatFullDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
// 
    static formatDateFlexible(dateString: string) {
        if (!dateString) {
            return "Never"
        }
        // Returns a human-readable "time ago" string (e.g., "3 days ago", "1 week ago", "1h ago")
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return years === 1 ? '1 year ago' : `${years} years ago`;
        if (months > 0) return months === 1 ? '1 month ago' : `${months} months ago`;
        if (weeks > 0) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
        if (hours > 0) return hours === 1 ? '1h ago' : `${hours}h ago`;
        if (minutes > 0) return minutes === 1 ? '1m ago' : `${minutes}m ago`;
        return 'Just now';
    }
}
