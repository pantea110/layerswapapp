import { motion } from "framer-motion"
import { FC } from "react"
import { Tab } from "./Index"

type HeaderProps = {
    tab: Tab,
    activeTabId: string,
    onCLick: (id: string) => void
}

const Header: FC<HeaderProps> = ({ tab, onCLick, activeTabId }) => {
    return <button
        key={tab.id}
        onClick={() => onCLick(tab.id)}
        className={`${activeTabId === tab.id ? "bg-secondary-600 text-primary-text" : "text-primary-text/50 hover:text-primary-text/70 bg-secondary-800"
            } grow rounded-md text-left relative py-3 px-5 text-sm transition`}
        style={{
            WebkitTapHighlightColor: "transparent",
        }}
    >
        {tab.icon}
        {activeTabId === tab.id && (
            <motion.span
                layoutId="bubble"
                className="absolute inset-0 z-10 bg-secondary-600 mix-blend-lighten border border-secondary-100"
                style={{ borderRadius: '6px' }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
            />
        )}
        {tab.label}
    </button>
}



export default Header