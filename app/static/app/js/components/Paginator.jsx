import React from 'react';
import '../css/Paginator.scss';
import { Link, withRouter  } from 'react-router-dom';
import SortPanel from './SortPanel';
import Utils from '../classes/Utils';
import { _ } from '../classes/gettext';

let decodeSearch = (search) => {
    return window.decodeURI(search.replace(/:/g, "#"));
};

class Paginator extends React.Component {
    constructor(props){
        super(props);

        const q = Utils.queryParams(props.location);
        
        this.state = {
            searchText: decodeSearch(q.search || ""),
            sortKey: q.ordering || "-created_at"
        }

        this.sortItems = [{
            key: "created_at",
            label: _("Created on")
          },{
            key: "name",
            label: _("Name")
          },{
            key: "tags",
            label: _("Tags")
          },{
            key: "owner",
            label: _("Owner")
          }];
    }

    componentDidMount(){
        document.addEventListener("onProjectListTagClicked", this.addTagAndSearch);
    }

    componentWillUnmount(){
        document.removeEventListener("onProjectListTagClicked", this.addTagAndSearch);
    }

    closeSearch = () => {
        this.searchContainer.classList.remove("open");
    }

    toggleSearch = e => {
        e.stopPropagation();
        setTimeout(() => {
            this.searchInput.focus();
        }, 50);
    }

    handleSearchChange = e => {
        this.setState({searchText: e.target.value});
    }

    handleSearchKeyDown = e => {
        if (e.key === "Enter"){
            this.search();
        }
    }
    
    search = () => {
        this.props.history.push({search: this.getQueryForPage(1)});
        this.closeSearch();
    }

    clearSearch = () => {
        this.setState({searchText: ""});
        setTimeout(() => {
            this.search();
        }, 0);
    }

    sortChanged = key => {
        this.setState({sortKey: key});
        setTimeout(() => {
            this.props.history.push({search: this.getQueryForPage(this.props.currentPage)});
        }, 0);
    }

    getQueryForPage = (num) => {
        return Utils.toSearchQuery({
            page: num,
            ordering: this.state.sortKey,
            search: this.state.searchText.replace(/#/g, ":")
        });
    }

    addTagAndSearch = e => {
        const tag = e.detail;
        if (tag === undefined) return;

        let { searchText } = this.state;
        if (searchText === "") searchText += "#" + tag;
        else searchText += " #" + tag;

        this.setState({searchText});
        setTimeout(() => {
            this.search();
        }, 0);
    }

    render() {
        const { itemsPerPage, totalItems, currentPage } = this.props;
        const { searchText } = this.state;

        let paginator = null;
        let clearSearch = null;
        let toolbar = (<div></div>);

        if (this.props.currentSearch){
            let currentSearch = decodeSearch(this.props.currentSearch);
            clearSearch = (<span className="clear-search">{_("Search results for:")} <span className="query">{currentSearch}</span> <a href="javascript:void(0);" onClick={this.clearSearch}>×</a></span>);
        }

        if (itemsPerPage && itemsPerPage && totalItems > itemsPerPage){
            const numPages = Math.ceil(totalItems / itemsPerPage);
            const MAX_PAGE_BUTTONS = 7;

            let rangeStart = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
            let rangeEnd = rangeStart + Math.min(numPages, MAX_PAGE_BUTTONS);
            if (rangeEnd > numPages){
                rangeStart -= rangeEnd - numPages - 1;
                rangeEnd -= rangeEnd - numPages - 1
            }
            let pages = [...Array(rangeEnd - rangeStart).keys()].map(i => i + rangeStart - 1);
            
            paginator = (
                <ul className="pagination pagination-sm">
                    <li className={currentPage === 1 ? "disabled" : ""}>
                      <Link to={{search: this.getQueryForPage(1)}}>
                        <span>&laquo;</span>
                      </Link>
                    </li>
                    {pages.map(page => {
                        return (<li
                            key={page + 1}
                            className={currentPage === (page + 1) ? "active" : ""}
                        ><Link to={{search: this.getQueryForPage(page + 1)}}>{page + 1}</Link></li>);
                    })}
                    <li className={currentPage === numPages ? "disabled" : ""}>
                      <Link to={{search: this.getQueryForPage(numPages)}}>
                        <span>&raquo;</span>
                      </Link>
                    </li>
                </ul>
              );
        }

        return [
            <div key="0" className="text-right paginator">{clearSearch}{toolbar}{paginator}</div>,
            this.props.children,
            <div key="2" className="text-right paginator">{paginator}</div>,
        ];
    }
}

export default withRouter(Paginator);
