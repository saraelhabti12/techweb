<x-mail::message>
# New Task Assigned

A new task has been assigned in the system.

**Title:** {{ $task->title }}  
**Project:** {{ $task->project->name ?? 'N/A' }}  
**Assigned To:** {{ $task->user->name ?? 'N/A' }}  
**Deadline:** {{ $task->deadline }}

**Description:**  
{{ $task->description ?? 'No description.' }}

<x-mail::button :url="url('/admin/tasks')">
View Tasks
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
