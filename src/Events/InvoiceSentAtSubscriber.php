<?php

namespace App\Events;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use App\Entity\Invoice;

class InvoiceSentAtSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setSentAtForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setSentAtForInvoice(GetResponseForControllerResultEvent $event) {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if ($invoice instanceof Invoice && $method === "POST") {
            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt(new \DateTime());
            }
        }
    }
}