// Helper function to get category name based on active tab
export function getTabCategory(tab: string): string {
  switch (tab) {
    case "ta":
      return "Tugas Akhir";
    case "kp":
      return "Kerja Praktek";
    case "bk":
      return "Bimbingan Karir";
    case "general":
      return "Fakultas";
    default:
      return "Umum";
  }
}

// Helper function to truncate HTML content safely
export function truncateHtml(html: string, maxLength: number): string {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Get the text content
  const textContent = tempDiv.textContent || tempDiv.innerText || "";

  // Check if truncation is needed
  if (textContent.length <= maxLength) {
    return html;
  }

  // Truncate the text content
  return textContent.substring(0, maxLength) + "...";
}

// Check if content needs to be truncated
export function needsTruncation(content: string, maxLength: number): boolean {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";
  return textContent.length > maxLength;
}

// Format date to Indonesian format (Date only)
export function formatDate(
  dateString: string | null,
  fallbackDate1?: string | null,
  fallbackDate2?: string | null
): string {
  const dateToFormat = dateString || fallbackDate1 || fallbackDate2;
  if (!dateToFormat) return "-";
  const date = new Date(dateToFormat);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Format time to Indonesian format (Time only)
export function formatTime(
  dateString: string | null,
  fallbackDate1?: string | null,
  fallbackDate2?: string | null
): string {
  const dateToFormat = dateString || fallbackDate1 || fallbackDate2;
  if (!dateToFormat) return "-";
  const date = new Date(dateToFormat);
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${time.replace(".", ":")} WIB`;
}

// Get badge variant based on type
export function getBadgeVariant(type: string): any {
  switch (type?.toLowerCase()) {
    case "ta":
      return "primary";
    case "kp":
      return "orange";
    case "bk":
      return "success";
    default:
      return "default";
  }
}

// Get theme color and background based on active tab
export function getTabTheme() {
  return {
    color: "blue",
    textColor: "text-primary-600",
    bgColor: "bg-primary-600",
    bgLight: "bg-primary-50",
    borderColor: "border-primary-200",
    hoverBg: "hover:bg-primary-100",
    gradientFrom: "from-primary-600",
    gradientTo: "to-primary-800",
  };
}
