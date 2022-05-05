import { useEffect, useState } from "react";

// https://stackoverflow.com/questions/52447828/is-there-a-way-to-modify-the-page-title-with-react-router-v4
/** Hook for changing title */
export const useTitle = (firstTitle: string | undefined) => {
  // const [oldTitle, setOldTitle] = useState<string>();
  const [title, setTitle] = useState<string | undefined>(firstTitle);

  useEffect(() => {
    const oldTitle = document.title;
    // reset title when component unmounts
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    title && (document.title = title);
  }, [title]);

  return { setTitle };
};
