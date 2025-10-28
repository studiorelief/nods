/**
 * Opens a Webflow dropdown programmatically
 * @param dropdownToggle - The dropdown toggle element (w-dropdown-toggle)
 * @param focusToggle - Whether to focus the toggle element after opening (default: false)
 */
export const openDropdown = (dropdownToggle: HTMLElement, focusToggle: boolean = false): void => {
  if (!dropdownToggle) {
    console.error('openDropdown: No dropdown toggle element provided');
    return;
  }

  // Find the parent dropdown container
  const dropdown = dropdownToggle.closest('.w-dropdown') as HTMLElement | null;

  if (!dropdown) {
    console.error('openDropdown: Could not find parent .w-dropdown element');
    return;
  }

  // Find the dropdown list
  const dropdownList = dropdown.querySelector('.w-dropdown-list') as HTMLElement | null;

  if (!dropdownList) {
    console.error('openDropdown: Could not find .w-dropdown-list element');
    return;
  }

  // Check if dropdown is already open
  if (dropdown.classList.contains('w--open')) {
    return;
  }

  // Add open class to dropdown container
  dropdown.classList.add('w--open');

  // Update toggle aria-expanded attribute
  dropdownToggle.setAttribute('aria-expanded', 'true');

  // Make the list visible
  dropdownList.style.display = 'block';

  // Optional: Focus the toggle if requested
  if (focusToggle) {
    dropdownToggle.focus();
  }
};

/**
 * Closes a Webflow dropdown programmatically
 * @param dropdownToggle - The dropdown toggle element (w-dropdown-toggle)
 * @param focusToggle - Whether to focus the toggle element after closing (default: true)
 */
export const closeDropdown = (dropdownToggle: HTMLElement, focusToggle: boolean = true): void => {
  if (!dropdownToggle) {
    console.error('closeDropdown: No dropdown toggle element provided');
    return;
  }

  // Find the parent dropdown container
  const dropdown = dropdownToggle.closest('.w-dropdown') as HTMLElement | null;

  if (!dropdown) {
    console.error('closeDropdown: Could not find parent .w-dropdown element');
    return;
  }

  // Find the dropdown list
  const dropdownList = dropdown.querySelector('.w-dropdown-list') as HTMLElement | null;

  if (!dropdownList) {
    console.error('closeDropdown: Could not find .w-dropdown-list element');
    return;
  }

  // Check if dropdown is already closed
  if (!dropdown.classList.contains('w--open')) {
    return;
  }

  // Remove open class from dropdown container
  dropdown.classList.remove('w--open');

  // Update toggle aria-expanded attribute
  dropdownToggle.setAttribute('aria-expanded', 'false');

  // Hide the list
  dropdownList.style.display = 'none';

  // Optional: Focus the toggle if requested
  if (focusToggle) {
    dropdownToggle.focus();
  }
};

/**
 * Toggles a Webflow dropdown open/closed state
 * @param dropdownToggle - The dropdown toggle element (w-dropdown-toggle)
 * @param focusToggle - Whether to focus the toggle element after toggling (default: false)
 */
export const toggleDropdown = (dropdownToggle: HTMLElement, focusToggle: boolean = false): void => {
  if (!dropdownToggle) {
    console.error('toggleDropdown: No dropdown toggle element provided');
    return;
  }

  const dropdown = dropdownToggle.closest('.w-dropdown') as HTMLElement | null;

  if (!dropdown) {
    console.error('toggleDropdown: Could not find parent .w-dropdown element');
    return;
  }

  // Check current state and toggle
  if (dropdown.classList.contains('w--open')) {
    closeDropdown(dropdownToggle, focusToggle);
  } else {
    openDropdown(dropdownToggle, focusToggle);
  }
};

/**
 * Checks if a dropdown is currently open
 * @param dropdownToggle - The dropdown toggle element (w-dropdown-toggle)
 * @returns boolean - True if dropdown is open, false otherwise
 */
export const isDropdownOpen = (dropdownToggle: HTMLElement): boolean => {
  if (!dropdownToggle) {
    return false;
  }

  const dropdown = dropdownToggle.closest('.w-dropdown') as HTMLElement | null;
  return dropdown ? dropdown.classList.contains('w--open') : false;
};
