import React from "react";
import PropTypes from "prop-types";
import "./css/Dashboard.scss";
import ProjectList from "./components/ProjectList";
import EditProjectDialog from "./components/EditProjectDialog";
import Utils from "./classes/Utils";
import { BrowserRouter as Router, Route } from "react-router-dom";
import $ from "jquery";
import { _ } from "./classes/gettext";

class Dashboard extends React.Component {
  static defaultProps = {
    permissions: [],
  };
  static propTypes = {
    permissions: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleAddProject = this.handleAddProject.bind(this);
    this.addNewProject = this.addNewProject.bind(this);
  }

  handleAddProject() {
    this.projectDialog.show();
  }

  addNewProject(project) {
    if (!project.name)
      return new $.Deferred().reject(_("Name field is required"));

    return $.ajax({
      url: `/api/projects/`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        name: project.name,
        description: project.descr,
        tags: project.tags,
      }),
    }).done(() => {
      this.projectList.refresh();
    });
  }

  render() {
    const projectList = ({ location, history }) => {
      let q = Utils.queryParams(location);
      if (q.page === undefined) q.page = 1;
      else q.page = parseInt(q.page);

      return (
        <ProjectList
          source={`/api/projects/${Utils.toSearchQuery(q)}`}
          ref={(domNode) => {
            this.projectList = domNode;
          }}
          currentPage={q.page}
          currentSearch={q.search}
          history={history}
        />
      );
    };

    return (
      <Router basename="/dashboard">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="welcome-message">Welcome Admin!</div>
            <div className="header-actions">
              {this.props.permissions.indexOf("add_project") !== -1 && (
                <button
                  type="button"
                  className="add-project-button"
                  onClick={this.handleAddProject}
                >
                  <i className="glyphicon glyphicon-plus"></i> Add project
                </button>
              )}
            </div>
          </header>

          <EditProjectDialog
            saveAction={this.addNewProject}
            ref={(domNode) => {
              this.projectDialog = domNode;
            }}
          />

          <main className="project-list-wrapper">
            <Route path="/" component={projectList} />
          </main>
        </div>
      </Router>
    );
  }
}

$(function () {
  $("[data-dashboard]").each(function () {
    let props = $(this).data();
    delete props.dashboard;
    window.ReactDOM.render(<Dashboard {...props} />, $(this).get(0));
  });

  window.onbeforeunload = function () {
    let found = false;
    $(".progress-bar:visible").each(function () {
      try {
        let value = parseFloat($(this).text());
        if (!isNaN(value) && value > 0 && value < 100) found = true;
      } catch (e) {}
    });
    return found
      ? _("Your changes will be lost. Are you sure you want to leave?")
      : undefined;
  };
});

export default Dashboard;
