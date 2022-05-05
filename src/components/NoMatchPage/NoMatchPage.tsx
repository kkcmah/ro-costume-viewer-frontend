import { useTitle } from "../../hooks/useTitle";

interface NoMatchPageProps {
  title: string;
}

const NoMatchPage = ({ title }: NoMatchPageProps) => {
  useTitle(title);

  return <h2>Sorry, the page you are looking for does not exist</h2>;
};

export default NoMatchPage;
