import Heading from '../../components/heading';

export default function GalleryHeader() {
    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <Heading title="File Manager" />
                <p className="text-muted-foreground">Manage public and private files in your application</p>
            </div>
        </div>
    );
}
