export const PROJECT_SELECTION_EVENT = "portfolio:select-project";

export interface ProjectSelectionDetail {
  projectId: number;
}

export function requestProjectSelection(projectId: number) {
  window.dispatchEvent(
    new CustomEvent<ProjectSelectionDetail>(PROJECT_SELECTION_EVENT, {
      detail: { projectId },
    }),
  );
}
