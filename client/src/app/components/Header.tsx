/* eslint-disable react/jsx-closing-tag-location */
import classNames from "classnames";
import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoHeader } from "../../assets/logo-header.svg";
import { ReactComponent as SmrLogoHeader } from "../../assets/smr-logo-header.svg";
import { ServiceFactory } from "../../factories/serviceFactory";
import { SettingsService } from "../../services/settingsService";
import FiatSelector from "./FiatSelector";
import "./Header.scss";
import { HeaderProps } from "./HeaderProps";
import { HeaderState } from "./HeaderState";
import NetworkSwitcher from "./NetworkSwitcher";

/**
 * Component which will show the header.
 */
class Header extends Component<HeaderProps, HeaderState> {
    /**
     * Settings service.
     */
     private readonly _settingsService: SettingsService;

    /**
     * Create a new instance of Header.
     * @param props The props.
     */
    constructor(props: HeaderProps) {
        super(props);

        this._settingsService = ServiceFactory.get<SettingsService>("settings");

        this.state = {
            isNetworkSwitcherExpanded: false,
            isUtilitiesExpanded: false,
            isMenuExpanded: false,
            darkMode: this._settingsService.get().darkMode ?? false
        };
    }

    /**
     * The component mounted.
     */
     public componentDidMount(): void {
        if (this.state.darkMode) {
            this.toggleModeClass();
        }
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        const { rootPath, currentNetwork, networks, history, action, search, utilities, pages } = this.props;

        return (
            <header className={classNames({ "smr-header-bg": this.props.network?.protocolVersion === STARDUST })}>
                <nav className="inner">
                    <div className="inner--main">
                        <div className="inner-wrapper">
                            <Link
                                to={rootPath}
                                onClick={() => this.resetExpandedDropdowns()}
                                className="logo-image--wrapper"
                            >
                                {
                                    this.props.network?.protocolVersion === STARDUST
                                    ? <div className="smr-logo-wrapper">
                                        <div className="smr-logo">
                                            <SmrLogoHeader />
                                        </div>
                                        <h2 className="smr-heading">EXPLORER</h2>
                                    </div>
                                    : <LogoHeader />
                                }
                            </Link>
                            {pages &&
                                pages.length > 0 &&
                                pages.map(page => (
                                    <Link
                                        key={page.url}
                                        to={page.url}
                                        onClick={() => this.setState({
                                            isUtilitiesExpanded: false,
                                            isNetworkSwitcherExpanded: false
                                        })}
                                        className={classNames("navigation--item",
                                            { "active-item": page.url === window.location.pathname })}
                                    >
                                        {page.label}
                                    </Link>
                                ))}
                            <div className="utilities--wrapper">
                                <div
                                    className={classNames("utilities--dropdown", {
                                        opened: this.state.isUtilitiesExpanded
                                    })}
                                    onClick={() =>
                                        this.setState({
                                            isUtilitiesExpanded: !this.state.isUtilitiesExpanded,
                                            isNetworkSwitcherExpanded: false
                                        })}
                                >
                                    <div className="label">Utilities</div>
                                    <div className="icon">
                                        <span className="material-icons">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div className={classNames("header--expanded", {
                                    opened: this.state.isUtilitiesExpanded
                                })}
                                >
                                    <div className="utilities">
                                        <div className="utilities--label">Utilities</div>
                                        {utilities?.map(utility => (
                                            <div key={utility.url} className="utilities--item">
                                                <Link
                                                    to={utility.url}
                                                    onClick={() =>
                                                        this.setState({ isUtilitiesExpanded: false })}
                                                    className={classNames(
                                                        { "active-item": utility.url === window.location.pathname }
                                                    )}
                                                >
                                                    {utility.label}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {this.state.isUtilitiesExpanded && (
                                    <div
                                        className="header--expanded--shield"
                                        onClick={() =>
                                            this.setState({ isUtilitiesExpanded: false })}
                                    />
                                )}
                            </div>
                            {/* ----- Only visible in mobile ----- */}
                            <div className="mobile-fiat">
                                <FiatSelector />
                            </div>
                            {/* ---------- */}

                            {search}

                            {/* ----- Only visible in desktop ----- */}
                            <div className="desktop-fiat">
                                <FiatSelector />
                            </div>
                        </div>
                        {/* ---------- */}
                        <button
                            type="button"
                            className="button--unstyled theme-toggle"
                            onClick={() => this.toggleMode()}
                        >
                            {this.state.darkMode ? <span className="material-icons">light_mode</span>
                                : <span className="material-icons">dark_mode</span>}
                        </button>
                        <div className="hamburger--menu">
                            <button
                                type="button"
                                className="button--unstyled hamburger--menu__icon"
                                onClick={() =>
                                    this.setState({ isMenuExpanded: !this.state.isMenuExpanded })}
                            >
                                {this.state.isMenuExpanded
                                    ? <span className="material-icons">close</span>
                                    : <span className="material-icons"> menu</span>}
                            </button>
                            <div
                                className={classNames("menu--expanded", {
                                    opened: this.state.isMenuExpanded
                                })}
                            >
                                <ul>
                                    {pages &&
                                        pages.length > 0 &&
                                        pages.map(page => (
                                            <Link
                                                key={page.url}
                                                to={page.url}
                                                onClick={() => this.resetExpandedDropdowns()}
                                            >
                                                <li className="menu--expanded__item" key={page.url}>
                                                    <span
                                                        className={classNames(
                                                            { "active-item": page.url === window.location.pathname }
                                                        )}
                                                    >
                                                        {page.label}
                                                    </span>
                                                </li>
                                            </Link>

                                        ))}
                                    <li
                                        className={classNames("menu--expanded__item", {
                                            opened: this.state.isUtilitiesExpanded
                                        })}
                                        onClick={() =>
                                            this.setState({
                                                isUtilitiesExpanded: !this.state.isUtilitiesExpanded
                                            })}
                                    >
                                        <div className="label">Utilities</div>
                                        <div className="icon">
                                            <span className="material-icons">
                                                expand_more
                                            </span>
                                        </div>
                                    </li>
                                    {/* ----- Only visible in mobile ----- */}
                                    <div className={classNames("utilities--mobile", {
                                        opened: this.state.isUtilitiesExpanded
                                    })}
                                    >
                                        {utilities?.map(utility => (
                                            <Link
                                                key={utility.url}
                                                to={utility.url}
                                                onClick={() =>
                                                    this.setState({
                                                        isMenuExpanded: false,
                                                        isNetworkSwitcherExpanded: false
                                                    })}
                                            >
                                                <li
                                                    key={utility.url}
                                                    className={classNames("menu--expanded__item margin-l-t",
                                                        { "active-item": utility.url === window.location.pathname })}
                                                >
                                                    {utility.label}
                                                </li>
                                            </Link>
                                        ))}
                                    </div>
                                    {/* ---------- */}
                                </ul>
                            </div>
                            {/* )} */}
                        </div>
                    </div>
                    <div className="inner--networks">
                        <NetworkSwitcher
                            eyebrow="Selected currentNetwork"
                            label={currentNetwork?.label}
                            networks={networks}
                            isExpanded={this.state.isNetworkSwitcherExpanded}
                            onClick={() => {
                                this.setState({
                                    isNetworkSwitcherExpanded:
                                        !this.state.isNetworkSwitcherExpanded,
                                    isUtilitiesExpanded: false
                                });
                            }}
                            onChange={targetNetwork => {
                                history?.push(
                                    action === "streams" ?
                                        `/${targetNetwork}/streams/0/` :
                                        (action === "visualizer" ?
                                         `/${targetNetwork}/visualizer/` :
                                         `/${targetNetwork}`)
                                );
                            }}
                        />
                    </div>
                </nav>
            </header >
        );
    }

    /**
     * Close expanded dropdowns
     */
    private resetExpandedDropdowns(): void {
        this.setState({
            isUtilitiesExpanded: false,
            isNetworkSwitcherExpanded: false,
            isMenuExpanded: false
        });
    }

    /**
     * Toggle the display mode.
     */
     private toggleMode(): void {
        this.setState({
            darkMode: !this.state.darkMode
        }, () => {
            this._settingsService.saveSingle("darkMode", this.state.darkMode);
        });
        this.toggleModeClass();
    }

    /**
     * Toggle darkmode classname to the body DOM node
     */
    private toggleModeClass(): void {
        const body = document.querySelector("body");
        body?.classList.toggle("darkmode");
    }
}

export default Header;
