import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { autobind } from "../decorators/autobind";
import { DropTarget } from "../models/drap-drop";
import { Project, ProjectStatus } from "../models/project";
import { projectState } from "../state/project";

// ProjectList Class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DropTarget
{
  private listElement: HTMLUListElement;
  private assignedProjects: Project[] = [];

  constructor(private type: ProjectStatus) {
    super("project-list", "root", "beforeend", `${type}-projects`);

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(
        (project) => project.status === this.type
      );
      this.renderProjects();
    });

    this.listElement = this.element.querySelector("ul")! as HTMLUListElement;

    this.configure();
    this.renderContent();
  }

  @autobind
  handleDragOver(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      this.listElement.classList.add("droppable");
    }
  }

  @autobind
  handleDrop(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(projectId, this.type);
  }

  @autobind
  handleDragLeave(_: DragEvent): void {
    this.listElement.classList.remove("droppable");
  }

  configure(): void {
    this.element.addEventListener("dragover", this.handleDragOver);
    this.element.addEventListener("drop", this.handleDrop);
    this.element.addEventListener("dragleave", this.handleDragLeave);
  }

  renderContent(): void {
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    this.listElement.id = `${this.type}-projects-list`;
  }

  private renderProjects(): void {
    this.listElement.innerHTML = "";

    for (let projectItem of this.assignedProjects) {
      new ProjectItem(this.listElement.id, projectItem);
    }
  }
}
