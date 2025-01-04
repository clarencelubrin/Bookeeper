export interface RouteProps {
    routeType: 'save' | 'download' | 'new_document' | 'rename';
    parameters: any;
    children: React.ReactElement;
}