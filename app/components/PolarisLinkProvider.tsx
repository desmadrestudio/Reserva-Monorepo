import { Link } from "@remix-run/react";
import type { LinkLikeComponentProps } from "@shopify/polaris";
import { AppProvider as PolarisProvider } from "@shopify/polaris";

export function PolarisLinkProvider({ children }: { children: React.ReactNode }) {
    const CustomLink = ({ url, external, ...rest }: LinkLikeComponentProps) => {
        if (external) {
            return <a href={url} {...rest} />;
        }

        return <Link to={url} {...rest} />;
    };

    return (
        <PolarisProvider linkComponent={CustomLink}>
            {children}
        </PolarisProvider>
    );
}