@component('mail::message')
# Nouveau message de contact

**Nom :** {{ $contact->full_name }}  
**Email :** {{ $contact->email }}  
**Message :**  
{{ $contact->message }}

@endcomponent
