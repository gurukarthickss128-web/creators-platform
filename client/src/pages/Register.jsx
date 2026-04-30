import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div>
      <h1>Create Account</h1>
      <p>Registration form will be added later.</p>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
}