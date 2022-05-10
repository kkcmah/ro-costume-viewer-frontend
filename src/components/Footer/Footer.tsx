import { Link } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <footer>
      <Typography
        component="div"
        mt={1}
        mx="auto"
        maxWidth="80vw"
        variant="caption"
        textAlign="center"
      >
        <Divider></Divider>
        Ragnarok Online is owned by Gravity Interactive, Inc. This
        non-commercial project is not endorsed by them and may go poof with or
        without notice. © 2022. Project here:{" "}
        <Link
          rel="noopener noreferrer"
          href="https://github.com/"
          target="_blank"
        >
          https://github.com/
        </Link>
      </Typography>
    </footer>
  );
};

export default Footer;
