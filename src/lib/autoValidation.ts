import axios from 'axios';

export async function validateLinkSubmission(link: string): Promise<boolean> {
  try {
    const response = await axios.get(link);
    
    // Check if the response is successful
    if (response.status === 200) {
      // You can add more specific checks here, such as:
      // - Checking for specific content on the page
      // - Verifying the domain of the link
      // - Checking for minimum content length
      
      // For now, we'll just check if the page contains the advocate's name or the challenge title
      // This is a simple example and should be expanded based on your specific requirements
      const pageContent = (response.data as string).toLowerCase();
      const advocateName = 'john doe'; // This should be dynamically set
      const challengeTitle = 'write a product review'; // This should be dynamically set
      
      return pageContent.includes(advocateName.toLowerCase()) || pageContent.includes(challengeTitle.toLowerCase());
    }
    
    return false;
  } catch (error) {
    console.error('Error validating link submission:', error);
    return false;
  }
}

