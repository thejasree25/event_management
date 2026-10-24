import { Link } from "react-router-dom";

export default function NotFound() {
  return <section className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>Looks like this event went missing.</h1><p>The page may have moved or the link may be incorrect.</p><Link to="/" className="btn btn-primary">Back to home</Link></section>;
}