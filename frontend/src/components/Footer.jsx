const Footer = () => {
    return (
        <footer className="py-10 border-t border-gray-100 mt-20 text-center">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} SERVIX Management System
            </p>
        </footer>
    );
};

export default Footer;