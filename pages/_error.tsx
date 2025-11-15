import type { NextPageContext } from 'next';
import { HoloPanel, HoloText } from '../components/ui/holo';

type ErrorProps = { statusCode?: number; message?: string };

function ErrorPage({ statusCode, message }: ErrorProps) {
  const code = statusCode || 500;
  const msg = message || 'Unexpected error';
  return (
    <div className="min-h-screen psychat-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <HoloPanel className="p-6">
          <div className="text-center space-y-3">
            <HoloText size="lg" weight="bold">Error</HoloText>
            <div className="text-white/80">{code}</div>
            <div className="text-white/70">{msg}</div>
            <div className="text-white/60 text-sm">Refreshing the page usually resolves transient issues.</div>
          </div>
        </HoloPanel>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  return {
    statusCode: res?.statusCode || err?.statusCode || 500,
    message: err?.message || undefined,
  } as ErrorProps;
};

export default ErrorPage;

