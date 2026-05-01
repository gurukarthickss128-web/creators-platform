import ConnectionTest from "../components/common/ConnectionTest";

export default function Home() {
  return (
    <div>
      <h1>Welcome to MyPlatform</h1>
      <p>This is a platform where creators share content.</p>
      <button>Get Started</button>

      <ConnectionTest />
    </div>
  );
}