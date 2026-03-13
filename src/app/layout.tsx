import { NotistackProvider } from "./SnackbarProviderClient";
import './global.css'


export const metadata = {
  title: "Reparaturcafe",
  description: "by AWO Oberlar e.V.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <div className="screen:text-lg print:text-sm font-medium relative">
          <NotistackProvider maxSnack={3}>
            {children}
          </NotistackProvider>
        </div>
      </body>
    </html>
  )
}