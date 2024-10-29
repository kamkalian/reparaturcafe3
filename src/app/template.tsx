
import Navigation from "./components/navigation/navbar";

export default function Template({ children }: { children: React.ReactNode }) {

    return (
        <> 
            <Navigation />
            <div className="screen:container mx-auto screen:px-4 screen:mt-10">
                {children}
            </div>
        </>
    )
  }