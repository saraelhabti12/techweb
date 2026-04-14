<x-mail::message>
# New Appointment Requested

An appointment has been requested by a member.

**Client:** {{ $appointment->client->name }}  
**Requested By:** {{ $appointment->user->name }}  
**Date:** {{ $appointment->appointment_date }}  

**Notes:**  
{{ $appointment->notes ?? 'No notes provided.' }}

<x-mail::button :url="url('/admin/appointments')">
View Appointments
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
